const Discord = require('discord.js');
const readline = require('readline');
const homeDir = require('os').homedir()
const fs = require('fs');

process.stdin.setEncoding('utf8');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cli=new Discord.Client();
var guildNames=[];
var curChannel=null;

/*when a EOF is recieved*/
process.stdin.on('end',function(){          
});

cli.on('ready', function(){
    console.log("Logged in as "+cli.user.username);
    console.log("\nType :h for help\n");
    guildNames=Array.from(cli.guilds.map(server=>server.name));
    rl.prompt();
});

cli.on('message',(msg)=>{
    if(curChannel!=null && msg.channel.id==curChannel.id && msg.author.username!=cli.user.username){ //print msg if on current channel
        console.log(msg.author.username+'-'+msg.content);
        rl.prompt();
    }    
});

function listAvailableServers(){
    console.log("Available servers:");
    for(i=0;i<guildNames.length; i++)
        console.log(i+'-'+guildNames[i]);
}

function listChannels(serverId){
    var serverName=guildNames[serverId];
    var server=(cli.guilds.filter(server=>server.name.localeCompare(serverName)==0).first(1))[0];
    if(server!=undefined){
        var channels=Array.from(server.channels.filter(ch=>ch.type!=null).values());
        console.log("Available channels:");
        for(i=0;i<channels.length;i++)
            console.log(i+'-'+channels[i].name);
    }else{
        console.log("Invalid server");
    }
}

function joinChannel(serverId,channelId){
    var serverName=guildNames[serverId];
    var server=(cli.guilds.filter(server=>server.name.localeCompare(serverName)==0).first(1))[0];
    if(server!=undefined){
        var channels=Array.from(server.channels.filter(ch=>ch.type!=null).values());
        if(0<=channelId<channels.length){
            curChannel=channels[channelId];
            console.log("Joined "+ curChannel.name+" sucessfully!");
        }else console.log("Invalid channel");
    }else console.log("Invalid server");
}

rl.on('line',(input)=>{
    if(input.localeCompare(':q')==0){
        cli.destroy();
        process.exit(0);
    }else if(input.localeCompare(':h')==0){
        console.log("All commands use the following syntax :<command>");
        console.log("Valid commands:");
        console.log(":h -> print this menu");
        console.log(":q -> quit");
        console.log(":ls ->list available servers");
        console.log(":lc id ->list available channels");
        console.log(":jc idS idC ->join channel with idC on server with idS");
    }else if(input.localeCompare(':ls')==0){            //list server
        listAvailableServers();
    }else if(input.substr(0,4).localeCompare(':lc ')==0){ //list channels on server
        input=input.split(' ');
        listChannels(Number(input[1]));
    }else if(input.substr(0,4).localeCompare(':jc ')==0){ //join server
        input=input.split(' ');
        joinChannel(Number(input[1]), Number(input[2]));
    }else{
        curChannel.send(input);
    }
    rl.prompt();
});

function login(token){
    cli.login(token);
}

function getToken(callback){
    configPath=homeDir+'/.disclirc';
    fs.readFile(configPath, 'utf8',(err,data)=>{
        if(err){ //file not found
            rl.question("Token:", function(tkn){
                fs.writeFileSync(configPath, tkn);
                callback(tkn);
            });
        }else{
            callback((data.split('\n'))[0]);
        }
    });
}

console.log("Discli-discord terminal client");
cliToken=getToken(login);

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
var curChannelId=-1;

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
    if(msg.channel.id==curChannelId) //print msg if on current channel
        console.log(msg.author.username+'-'+msg.content);
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
        var channels=server.channels.map(ch=>ch.name);
        console.log("Available channels:")          
        for(i=0;i<channels.length; i++)
            console.log(i+'-'+channels[i]);
    }else{
        console.log("Invalid server");
    }
}

function joinChannel(serverId,channelId){
    var serverName=guildNames[serverId];
    var server=(cli.guilds.filter(server=>server.name.localeCompare(serverName)==0).first(1))[0];
    if(server!=undefined){
        var channel=server.channels.map(ch=>ch.name).get(channel);
    }
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
        console.log(":js idS idC ->join channel with idC on server with idS");
    }else if(input.localeCompare(':ls')==0){            //list server
        listAvailableServers();
    }else if(input.substr(0,4).localeCompare(':lc ')==0){ //list channels on server
        listChannels(Number(input.substr(4,)));
    }else if(input.substr(0,3).localeCompare(":js")){ //join server
        //TODO:join server 
    }else if(input.substr(0,4).localeCompare(":jc ")){ //join server
        //TODO:join channel  
        
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

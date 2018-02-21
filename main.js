const Discord = require('discord.js');
const notifier = require('node-notifier');
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

// Display or notify user when new message arrives
cli.on('message',(msg)=>{
    if(curChannel!=null && msg.channel.id==curChannel.id && msg.author.username!=cli.user.username){ //print msg if on current channel
        console.log(msg.author.username+'-'+msg.content);
        rl.prompt();
    }else if(msg.channel.muted==false){
        var title=msg.author;
        if(msg.channel.name!=undefined) //if it's not a dm channel
            title += ' '+'('+msg.channel.guild+','+msg.channel.name+')';
        notifier.notify({
            'title':title,
            'message':msg.content
        });
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

function listDMChannels(){
    var friends=Array.from(cli.user.friends.values());
    for(let friend of friends)
        console.log(friend.username+'('+friend.presence.status+')');
}

function joinChannel(serverId,channelId){
    var serverName=guildNames[serverId];
    var server=(cli.guilds.filter(server=>server.name.localeCompare(serverName)==0).first(1))[0];
    if(server!=undefined){
        var channels=Array.from(server.channels.filter(ch=>ch.type!=null).values());
        if(0<=channelId<channels.length){
            curChannel=channels[channelId];
            console.log("Joined "+ curChannel.name+" sucessfully!");
            rl.setPrompt(curChannel.name+">");
        }else console.log("Invalid channel");
    }else console.log("Invalid server");
}

function joinDmChannel(fName){
    var friend=(cli.user.friends.filter(f=>f.username.localeCompare(fName)==0).first(1))[0];
    if(friend!=undefined){
        curChannel=friend.dmChannel;
        console.log("Now chatting with "+friend.username); 
    }else console.log("Invalid username");
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
        console.log(":lf ->list friends and their status");
        console.log(":lc id ->list available channels");
        console.log(":jc idS idC ->join channel with idC on server with idS");
        console.log(":dm fName ->join dm channel with friend fName");
        console.log(":m idS -> mute server with idS");
    }else if(input.localeCompare(':ls')==0){            //list server
        listAvailableServers();
    }else if(input.localeCompare(':lf')==0){                        //list dm channels
        listDMChannels();
    }else if(input.substr(0,4).localeCompare(':lc ')==0){ //list channels on server
        input=input.split(' ');
        listChannels(Number(input[1]));
    }else if(input.substr(0,4).localeCompare(':jc ')==0){ //join server
        input=input.split(' ');
        joinChannel(Number(input[1]), Number(input[2]));
    }else if(input.substr(0,4).localeCompare(':dm ')==0){
        input=input.split(' ') ;
        joinDmChannel(input[1]);
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

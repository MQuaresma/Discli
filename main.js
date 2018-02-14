const Discord = require('discord.js');
const readline = require('readline');
const fs = require('fs');

process.stdin.setEncoding('utf8')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const cli=new Discord.Client();

/*when a EOF is recieved*/
process.stdin.on('end',function(){          
});

cli.on('ready', function(){
    console.log("Logged in as "+cli.user.username);
    console.log("\nType :h for help\n");
    rl.prompt();
});

function listAvailableChannels(){
    var guildNames=Array.from(cli.guilds.map(server=>server.name));
    console.log("Available channels:");
    for(i=0;i<guildNames.length; i++)
        console.log(i+'-'+guildNames[i]);
}

rl.on('line',(input)=>{
    if(input.localeCompare(':q')==0){
        cli.destroy();
        process.exit(0);
        //TODO:quit client
    }else if(input.localeCompare(':h')==0){
        //TODO:show help
        console.log("All commands use the following syntax :<command>");
        console.log(":q->quit");
        console.log(":ls->list available servers");
        console.log(":lc->list available channels");
        console.log(":js id->join server with id");
    }else if(input.localeCompare(':ls')==0){            //list server
        listAvailableChannels();
    }else if(input.substr(0,3).localeCompare(':lc')==0){ //list channels on server
        //TODO:list channels on current server    
    }else if(input.substr(0,3).localeCompare(":js")){ //join server
        //TODO:join server 
    }else if(input.substr(0,3).localeCompare(":jc")){ //join server
        //TODO:join channel  
    } 
    rl.prompt();
});

function login(token){
    cli.login(token);
}

function getToken(callback){
    fs.readFile('/Users/miguelq/.disclirc', 'utf8',(err,data)=>{
        if(err){ //file not found
            rl.question("Token:", function(tkn){
                fs.writeFileSync('/Users/miguelq/.disclirc', tkn);
                callback(tkn);
            });
        }else{
            callback((data.split('\n'))[0]);
        }
    });
}

console.log("Discli-discord terminal client");
cliToken=getToken(login);

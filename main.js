const Discord = require('discord.js');
const readline = require('readline');
const authentication = require("./userAuth");

process.stdin.setEncoding('utf8')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

main();

/*when a EOF is recieved*/
process.stdin.on('end',function(){          
});

function main(){
    console.log("Discli-discord terminal client");
    authentication.getConfig(rl);
}

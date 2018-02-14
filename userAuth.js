const fs=require('fs');

module.exports.getConfig=function(rl){
    if(fs.existsSync('/Users/miguelq/.disclirc')==false)
        return authenticate(rl);
    else return login();
}

function authenticate(rl){
    rl.question("Username:", function(usr){
        rl.question("Password:", function(pwd){
            fs.writeFileSync('/Users/miguelq/.disclirc', usr+'\n'+pwd, 'utf8','w');
            return login();
        });
    });
}

function login(){
    var data=fs.readFileSync('/Users/miguelq/.disclirc', 'utf8');
    if(data){
        data=data.split('\n');
        if(data.length!=2){
            console.log("Error reading config file, exiting...");
            process.exit(1); //terminate process with error code
        }
        //usr=data[0];
        //pwd=data[1];
        return {usr: data[0], pwd: data[1]};
        //TODO: create client to log user
    }
}

//const client= new Discord.Client();

const Discord = require('discord.js');
const YTDL = require("ytdl-core");

const TOKEN = 'NTM5NDE1MjY4OTg4OTQ0Mzg0.D0BQCw.F-HB1mAUJEIUkF6jrOpGw3LM41c';
const PREFIX = '*';

var version = 'W1.2'

var bot = new Discord.Client();

var servers = {};

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

bot.on('ready', () =>{
    console.log('Deploy');
})

bot.on('message', message=>{

    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'ping':
            message.channel.sendMessage('pong!');
            break;
        case 'youtube':
            message.channel.sendMessage('https://www.youtube.com/channel/UCsKKeh9JuaGNUo9dLmVPHzQ')
            break;
        case 'info':
            if(args[1] === 'author'){
                message.channel.sendMessage('**CCWee** aka **Wee**')
            }else
            if(args[1] === 'version'){
                message.channel.sendMessage('Version ' + version);
            }else{
                message.channel.sendMessage('Invalid Command :L')
                message.channel.sendMessage('That is available commands -> *info version, *info author :3')    
            }
            break; 
        case 'clear':
            if(!args[1]) return message.reply('**Woops..** Please enter amount line.')
            message.channel.bulkDelete(args[1]);
            break;
        case 'steam':
            message.channel.sendMessage('https://www.steamcommunity.com/id/saltynotgood')
            break;
        case 'help':
        if(args[1] === 'info'){
            message.channel.sendMessage('Help for info -> *info version, *info author')
        }else{
            message.channel.sendMessage('This is the commands list :3 -> *clear [number], *ping, *youtube, *info, *steam')
            }
            break;
        case 'play':
            if (!args[1]) {
                message.channel.reply("Please provide a link");
                return;
            }
            
            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice channel");
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            };

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
        case "skip":
            var server = servers[message.guild.id];

            if (server.dispatcher) server.dispatcher.end();
            break;
        case "stop":
            var server = servers[message.guild.id];

            if (message.guild.voiceConnection)
        {
            for (var i = server.queue.length - 1; i >= 0; i--) 
            {
                server.queue.splice(i, 1);
         }
            server.dispatcher.end();
            console.log("[" + new Date().toLocaleString() + "] Stopped the queue.");
        }
            break;
            message.channel.sendMessage("Invalid command");
    }
})

bot.login(TOKEN);
const Discord = require('discord.js');
const { GatewayIntentBits } = Discord;
const bot_config = require('./configs/bot.json');
const log = require('./utils/logger');
const fs = require('fs');

const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

let bannedWords = [];
try {
    const data = fs.readFileSync('./configs/banned_words.json');
    const json = JSON.parse(data);
    bannedWords = json.bannedWords;
    log(`Loaded ${bannedWords.length} banned words from JSON file.`);
} catch (err) {
    log(`Error reading banned_words.json: ${err.message}`);
}

client.on('ready', () => {
    log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', (message) => {
    log(`New message from ${message.author.tag}: ${message.content}`);

    for (const word of bannedWords) {
        if (message.content.toLowerCase().includes(word)) {
            message.delete();
            message.author.send(`Your message was deleted for containing the banned word "${word}".`);
            log(`Deleted message from ${message.author.tag} for containing "${word}".`);
            break;
        }
    }
});

client.login(bot_config.token); 

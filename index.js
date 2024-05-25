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

const activities = [
 { name: '🛡️ Protecting the server', type: Discord.ActivityType.Custom },
 { name: '🧹 Cleaning up chats', type: Discord.ActivityType.Custom },
 { name: '💬 Helping users', type: Discord.ActivityType.Custom },
];
let currentActivityIndex = 0;
function updateActivity() {
   client.user.setPresence({
       activities: [activities[currentActivityIndex]],
       status: 'idle',
   });
   currentActivityIndex = (currentActivityIndex + 1) % activities.length;
}
client.on('ready', () => {
    log(`Logged in as ${client.user.tag}!`);
    updateActivity();
    setInterval(updateActivity, 30 * 1000);
});

client.on('messageCreate', (message) => {
    log(`New message from ${message.author.tag}: ${message.content}`);
    const messageContent = message.content.toLowerCase();

    for (const word of bannedWords) {
        const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedWord.replace(/[aeiou]/gi, "[aeiou0-9@]"), "gi");
        if (regex.test(messageContent)) {
              const originalMessageContent = message.content;
              message.delete();
      
              const serverName = message.guild.name; 
              const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
      
              const reportMessageEmbed = new Discord.EmbedBuilder()
                  .setColor('#FF0000')
                  .setTitle('New Report!')
                  .setDescription(`${message.author.tag} has been reported for using a banned word.`)
                  .addFields(
                      { name: 'Reported User', value: message.author.tag, inline: true },
                      { name: 'Reason', value: 'Banned Word Usage', inline: true },
                      { name: 'Server', value: serverName, inline: true },
                      { name: 'Time (EST)', value: currentTime, inline: true },
                      { name: 'Original Message', value: originalMessageContent }
                  )
                  .setTimestamp();

              const reportChannel = client.channels.cache.get(bot_config.reports_channel_id);
              if (reportChannel) {
                  reportChannel.send({ embeds: [reportMessageEmbed] });
              }
              const userWarningEmbed = new Discord.EmbedBuilder()
                 .setColor('#FFD700')
                 .setTitle('Warning')
                 .setDescription(`Your message in **${serverName}** was deleted for containing a variation of the banned word "${word}". Please review the server rules and avoid using inappropriate language.`)
                 .setTimestamp();
             message.author.send({ embeds: [userWarningEmbed] });
        }
    }
});

client.login(bot_config.token); 

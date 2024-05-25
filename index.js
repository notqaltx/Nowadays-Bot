const Discord = require('discord.js');
const { Client, Collection, Events, Routes, REST, GatewayIntentBits } = Discord;

const { 
   token, clientId, guildId, moderation
} = require('./configs/bot.json');
const log = require('./utils/logger');
const fs = require('node:fs');
const path = require('node:path');
const rest = new REST({ version: 10 }).setToken(token);

let bannedWords = [];
let currentActivityIndex = 0;
const userMessageTimestamps = new Collection();
const warnedUsers = new Set();

const activities = [
   { name: '🛡️ Protecting the server', type: Discord.ActivityType.Custom },
   { name: '🧹 Cleaning up chats', type: Discord.ActivityType.Custom },
   { name: '💬 Helping users', type: Discord.ActivityType.Custom },
];
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        log(`[WARNING] The command at ${filePath} is missing a required data or execute property`);
    }
}

function updateActivity() {
   client.user.setPresence({
       activities: [activities[currentActivityIndex]],
       status: 'idle',
   });
   currentActivityIndex = (currentActivityIndex + 1) % activities.length;
}
client.on('ready', async () => {
   log(`Logged in as ${client.user.tag}!`);
   updateActivity();
   setInterval(updateActivity, 30 * 1000);
});

client.on(Events.InteractionCreate, async interaction => {
   if (!interaction.isChatInputCommand()) return;
   const command = interaction.client.commands.get(interaction.commandName);
   if (!command) {
       log(`No command matching for ${interaction.commandName} was found.`);
       return;
   }
   try {
       await command.execute(interaction, client);
   } catch (error) {
       console.log(error);
       await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
   }
});

try {
   const data = fs.readFileSync('./configs/banned_words.json');
   const json = JSON.parse(data);
   bannedWords = json.bannedWords;
   log(`Loaded ${bannedWords.length} banned words from JSON file.`);
} catch (err) {
   log(`Error reading banned_words.json: ${err.message}`);
}
client.on('messageCreate', async (message) => {
    log(`New message from ${message.author.tag}: ${message.content}`);
    const messageContent = message.content.toLowerCase();

    const userId = message.author.id;
    const now = Date.now();
    let timestamps = userMessageTimestamps.get(userId) || [];
    timestamps.push(now);

    const recentTimestamps = timestamps.filter(t => now - t < moderation.timeLimit); 
    userMessageTimestamps.set(userId, recentTimestamps);
    if (recentTimestamps.length > moderation.messageLimit) {
        const messagesToDelete = await message.channel.messages.fetch({ limit: moderation.messageLimit + 1 })
            .then(messages => messages.filter(msg => 
                msg.author.id === userId &&
                now - msg.createdTimestamp < moderation.timeLimit
            ))
            .catch(error => {
                log(`Error fetching messages: ${error}`);
                return [];
            });
        if (messagesToDelete.size > 0) {
            await message.channel.bulkDelete(messagesToDelete);
            if (!warnedUsers.has(userId)) {
                const warningMessage = `You are sending messages too quickly. Please slow down.`;
                try {
                    await message.author.send(warningMessage);
                    log(`Deleted multiple messages from ${message.author.tag} for spamming.`);
                } catch (error) {
                    log(`Failed to DM ${message.author.tag}: ${error}`);
                }
                warnedUsers.add(userId);
                setTimeout(() => {
                    warnedUsers.delete(userId);
                }, moderation.timeLimit); 
            }
        }
        return;
    }
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

              const reportChannel = client.channels.cache.get(moderation.reportsId);
              if (reportChannel) {
                  reportChannel.send({ embeds: [reportMessageEmbed] });
              }
              const userWarningEmbed = new Discord.EmbedBuilder()
                 .setColor('#FFD700')
                 .setTitle('Warning')
                 .setDescription(`Your message in **${serverName}** was deleted for containing a variation of the banned word "${word}".\
                      Please review the server rules and avoid using inappropriate language.`)
                 .setTimestamp();
             message.author.send({ embeds: [userWarningEmbed] });
        }
    }
});

client.login(token); 

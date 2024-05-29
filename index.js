const express = require("express");
const app = express();

const Discord = require('discord.js');
const { Client, Collection, Events, Routes, REST, GatewayIntentBits } = Discord;

require('dotenv').config()
const { TOKEN, GUILD_ID, CLIENT_ID } = process.env;

const rest = new REST({ version: 10 }).setToken(TOKEN);
const DeployCommands = require('./components/commands/deploy-commands.main');
const LoadComponents = require('./components/load-components.main');

const { moderation } = require('./configs/bot.json');
const settings = require('./configs/settings.json');

const Logger = require('./utils/log.util');
const AntiCrash = require('./utils/anti-crash.util');
AntiCrash.init();

const log = new Logger();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();
client.aliases = new Collection();

app.get('/ping', (req, res) => {
 res.sendStatus(200); 
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { log.info(`Server is running on port ${PORT}!`); });

// # LOAD COMMANDS AND COMPONENTS
DeployCommands.init( client, rest, Routes, CLIENT_ID, GUILD_ID );
LoadComponents.init( client, moderation );

let currentActivityIndex = 0;
const activities = [
    { name: '🛡️ Protecting the server', type: Discord.ActivityType.Custom },
    { name: '🧹 Cleaning up chats', type: Discord.ActivityType.Custom },
    { name: '💬 Helping users', type: Discord.ActivityType.Custom },
];
function updateActivity() {
    client.user.setPresence({
        activities: [activities[currentActivityIndex]],
        status: 'idle',
    });
    currentActivityIndex = (currentActivityIndex + 1) % activities.length;
}
client.on('ready', async () => {
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) {
        log.error(`Guild with ID ${GUILD_ID} not found.`);
        return; 
    }
    log.info(`Logged in as ${client.user.tag}!`);
    updateActivity();
    setInterval(updateActivity, 30 * 1000);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) {
        log.error(`No command matching for ${interaction.commandName} was found.`);
        return;
    }
    try { await command.execute(interaction, client);
    } catch (error) {
        log.fatal(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.on('messageCreate', async (message) => {
    if (settings.debug_messages) {
      if (message.author.id === client.user.id) { return; }
      log.debug(`New message from ${message.author.tag}: ${message.content}`);
    }
});

client.login(TOKEN); 

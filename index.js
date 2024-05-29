const Discord = require('discord.js');
const { Client, Collection, Events, Routes, REST, GatewayIntentBits } = Discord;

const { token, clientId, guildId, moderation } = require('./configs/bot.json');
const settings = require('./configs/settings.json');
const Logger = require('./utils/log');
const log = new Logger();

const rest = new REST({ version: 10 }).setToken(token);
const DeployCommands = require('./utils/Commands/DeployCommands');
const LoadComponents = require('./utils/LoadComponents');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
client.commands = new Collection();
client.aliases = new Collection();

// # LOAD COMMANDS AND COMPONENTS
DeployCommands( client, rest, Routes, clientId, guildId );
LoadComponents( client, moderation );

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
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
        log.error(`Guild with ID ${guildId} not found.`);
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

client.login(token); 

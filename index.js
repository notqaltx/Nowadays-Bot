const express = require("express");
const app = express();

const Discord = require('discord.js');
const { Client, Collection, Events, Routes, REST, GatewayIntentBits } = Discord;

require('dotenv').config()
const { TOKEN, GUILD_ID, CLIENT_ID, CLIENT_SECRET_ID, PORT } = process.env;

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
const clientUtils = require('./components/client.utils');
clientUtils.setClient(client);
client.commands = new Collection();
client.aliases = new Collection();

const MAIN_PORT = PORT || 2222;
app.get('/', async ({ query }, response) => {
   const { code } = query;
   if (code) {
     try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
         method: 'POST',
         body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET_ID,
            code,
            grant_type: 'authorization_code',
            redirect_uri: `http://localhost:${port}`,
            scope: 'identify',
         }).toString(),
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         },
       });
       const oauthData = await tokenResponseData.body.json();
       const userResult = await request('https://discord.com/api/users/@me', {
         headers: {
           authorization: `${oauthData.token_type} ${oauthData.access_token}`,
         },
       });
       console.log(await userResult.body.json());
     } catch (error) { console.error(error); }
   }
	  return response.sendFile('./oauth2/index.html', { root: '.' });
});
app.get('/ping', (request, response) => { response.sendStatus(200); });
app.listen(MAIN_PORT, () => { log.info(`Server is running on port ${MAIN_PORT}!`); });

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
        if (!interaction.replied && !interaction.deferred) { 
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on('messageCreate', async (message) => {
    if (settings.debug_messages) {
      if (message.author.id === client.user.id) { return; }
      log.debug(`New message from ${message.author.tag}: ${message.content}`);
    }
});

client.login(TOKEN); 

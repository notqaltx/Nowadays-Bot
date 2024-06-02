const express = require("express");
const app = express();

const Discord = require('discord.js');
const { Client, Collection, Routes, REST, GatewayIntentBits } = Discord;

const bot = require('./components/configs/bot.config');
const Logger = require('./components/utils/log.util');
const log = new Logger();

const rest = new REST({ version: 10 }).setToken(bot.token);
const AntiCrash = require('./components/utils/anti-crash.util');
AntiCrash.init();

const LoadCommands = require('./components/commands/deploy-commands.main');
const LoadComponents = require('./components/load-components.main');
const LoadEvents = require('./components/load-events.main');

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

const MAIN_PORT = bot.developer.oauth.port
app.get('/', async ({ query }, response) => {
   const { code } = query;
   if (code) {
     try {
        const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
         method: 'POST',
         body: new URLSearchParams({
            client_id: bot.clientId,
            client_secret: bot.clientSecret,
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

// # LOAD COMMANDS, COMPONENTS AND EVENTS
LoadCommands.init( client, rest, Routes );
LoadComponents.init( client );
LoadEvents.init( client );

client.login(bot.token); 

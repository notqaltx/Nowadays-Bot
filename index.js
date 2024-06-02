const Discord = require('discord.js');
const { Client, Collection, Routes, REST, GatewayIntentBits } = Discord;

const bot = require('./components/configs/bot.config');
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

// # LOAD COMMANDS, COMPONENTS AND EVENTS
LoadCommands.init( client, rest, Routes );
LoadComponents.init( client );
LoadEvents.init( client );

client.login(bot.token); 

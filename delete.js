// Delete Application Commands.
const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./configs/bot.json');
const log = require('./utils/logger');

const rest = new REST({ version: 10 }).setToken(token);
try {
   rest.put(
     Routes.applicationCommands(clientId, guildId), 
     { body: [] }
   );
   log(`Successfully deleted all Application Commands.`);
} catch (error) {
   log(error);
}

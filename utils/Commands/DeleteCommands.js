// Delete Application Commands.
const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('../../configs/bot.json');
const Logger = require('../log');
const log = new Logger();

const rest = new REST({ version: 10 }).setToken(token);
try {
   rest.put(
     Routes.applicationCommands(clientId, guildId), 
     { body: [] }
   );
   log.info(`Successfully deleted all Application Commands.`);
} catch (error) {
   log.error(error);
}

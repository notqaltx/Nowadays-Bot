// Delete Application Commands.
const { REST, Routes } = require('discord.js');
const Logger = require('../../utils/log.util');
const log = new Logger();

require('dotenv').config()
const { TOKEN, GUILD_ID, CLIENT_ID } = process.env;
const rest = new REST({ version: 10 }).setToken(TOKEN);

try {
   rest.put(
     Routes.applicationCommands(CLIENT_ID, GUILD_ID), 
     { body: [] }
   );
   log.info(`Successfully deleted all Application Commands.`);
} catch (error) {
   log.error(error);
}

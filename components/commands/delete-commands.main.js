const { REST, Routes } = require('discord.js');

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

const rest = new REST({ version: 10 }).setToken(bot.token);
try {
   rest.put(
     Routes.applicationCommands(bot.clientId, bot.guildId), 
     { body: [] }
   );
   log.info(`Successfully deleted all Application Commands.`);
} catch (error) {
   log.error(error);
}

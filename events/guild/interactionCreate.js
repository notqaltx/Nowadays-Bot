const { Events } = require('discord.js');
const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) { 
        if (!interaction.isChatInputCommand()) return;
        const commandName = interaction.commandName;
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) {
            if (bot.developer.debug) { log.error(`No command matching for ${interaction.commandName} was found.`); }
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
    },
};

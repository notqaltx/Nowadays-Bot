const { SlashCommandBuilder, PermissionFlagsBits, PresenceUpdateStatus } = require('discord.js');
const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setstatus')
        .setDescription('Set the bot\'s status (admin only)')
        .addStringOption(option =>
            option.setName('status')
                .setDescription('The desired status (online, idle, dnd, invisible)')
                .setRequired(true)
                .addChoices(
                    { name: 'Online', value: PresenceUpdateStatus.Online },
                    { name: 'Idle', value: PresenceUpdateStatus.Idle },
                    { name: 'Do Not Disturb', value: PresenceUpdateStatus.DoNotDisturb },
                    { name: 'Invisible', value: PresenceUpdateStatus.Invisible }
                )),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (bot.developer.debug) {
               log.warn(`${interaction.user.tag} tried to change the Bot Status without Administrator permission.`);
            }
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        const status = interaction.options.getString('status');
        try {
            await interaction.client.user.setPresence({ status: status });
            if (bot.developer.debug) { log.info(`Bot status changed to ${status} by ${interaction.user.tag}`); }
            return interaction.reply({ content: `Bot status changed to \`${status}\`.`, ephemeral: true });
        } catch (error) {
            if (bot.developer.debug) { log.error(`Error changing bot status: ${error}`); }
            return interaction.reply({ content: 'An error occurred while changing the bot\'s status.', ephemeral: true });
        }
    },
};

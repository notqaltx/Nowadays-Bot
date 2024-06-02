const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member for a specified duration.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to timeout.')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration of the timeout in minutes.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the timeout.')),
    async execute(interaction, client) {
        const target = interaction.options.getMember('target');
        const durationMinutes = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided.';

        if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) { return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }); }
        if (!target) { return interaction.reply({ content: 'Please mention a valid member to timeout.', ephemeral: true }); }
        if (target.user.id === client.user.id) { return interaction.reply({ content: 'I cannot timeout myself.', ephemeral: true }); }
        if (durationMinutes < 1 || durationMinutes > 1440) { return interaction.reply({ content: 'Timeout duration must be between 1 and 1440 minutes.', ephemeral: true }); }
        const durationMs = durationMinutes * 60 * 1000;
        try {
            await target.timeout(durationMs, reason);
            return interaction.reply({ content: `${target.user.tag} has been timed out for ${durationMinutes} minutes. Reason: ${reason}` });
        } catch (error) {
           if (error.code === 50013) {
               log.fatal('Bot does not have permission to timeout members.');
               return interaction.reply({ content: 'I do not have permission to timeout members.', ephemeral: true });
           } else {
               log.error(error);
               return interaction.reply({ content: 'An error occurred while attempting to timeout the user.', ephemeral: true });
           }
        }
    },
};

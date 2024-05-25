const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a specified user from the server.')
        .addUserOption(option => option.setName('target').setDescription('The user to kick.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kicking.')),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        if (!target.kickable) {
            return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true });
        }
        try {
            await target.kick(reason);
            await interaction.reply({ content: `${target.user.tag} has been kicked. Reason: ${reason}` });
        } catch (error) {
            log(`Error kicking user: ${error}`);
            await interaction.reply({ content: 'There was an error while kicking this user.', ephemeral: true });
        }
    },
};

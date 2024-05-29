const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { moderation } = require('../../configs/bot.json')
const Logger = require('../../utils/log.util');
const log = new Logger();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a specified user from the server.')
        .addUserOption(option => option.setName('target').setDescription('The user to kick.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for kicking.')),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const serverName = interaction.guild.name;

        if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) { return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }); }
        if (!target.kickable) { return interaction.reply({ content: 'I cannot kick this user.', ephemeral: true }); }
        try {
            await target.kick(reason);
            const reportEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Member Kicked')
                .setDescription(`${target.user.tag} has been kicked from the server.`)
                .addFields(
                    { name: 'Kicked User', value: target.user.tag, inline: true },
                    { name: 'Kicked By', value: interaction.user.tag, inline: true },
                    { name: 'Reason', value: reason, inline: true },
                    { name: 'Time', value: new Date().toLocaleString() }
            );
            const reportChannel = interaction.guild.channels.cache.get(moderation.reportsId);
            if (reportChannel) {
                await reportChannel.send({ embeds: [reportEmbed] });
            } else {
                log.error('Report channel not found.');
            }
            const userEmbed = new EmbedBuilder()
                 .setColor('#FF0000')
                 .setTitle("You've been kicked.")
                 .setDescription(`You've been kicked from the **${serverName}**\ by: 
                      ${interaction.user.tag}. Reason: ${reason}`)
                 .setTimestamp();
            try {
                await target.send({ embeds: [userEmbed] });
            } catch (error) {
                log.error(`Failed to send DM to kicked user ${target.user.tag}: ${error}`);
            }
        } catch (error) {
            log.fatal(`Error kicking user: ${error}`);
            await interaction.reply({ content: 'There was an error while kicking this user.', ephemeral: true });
        }
    },
};

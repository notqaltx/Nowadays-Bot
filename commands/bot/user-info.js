// user-info.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('👤 Provides information about a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get information about.')
                .setRequired(false)),
    async execute(interaction) {
        const target = interaction.options.getMember('user') || interaction.member;
        await target.user.fetch(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const statusEmoji = { online: "🟢", idle: "🌙", dnd: "🔴", offline: "⚫", undefined: "❔" };
        const status = target.presence?.status;
        const statusWithEmoji = statusEmoji[status] || statusEmoji['undefined'];

        const roles = target.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.toString())
            .join(', ') || 'No roles';

        const embed = new EmbedBuilder()
            .setColor(target.displayHexColor)
            .setTitle(`${statusWithEmoji} ${target.user.tag}'s Information`)
            .setThumbnail(target.user.displayAvatarURL({ size: 1024 }))
            .addFields(
                { name: '🆔 ID:', value: `||\`${target.user.id}\`||`, inline: true },
                { name: '👤 Username:', value: `\`${target.user.username || 'None'}\``, inline: true },
                { name: '🏷️ Display Name:', value: `\`${target.displayName || 'None'}\``, inline: true },
                { name: '📆 Joined Server:', value: `<t:${Math.round(target.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: '📆 Joined Discord:', value: `<t:${Math.round(target.user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '🎭 Roles:', value: roles }
            );
        await interaction.reply({ embeds: [embed] });
    },
};

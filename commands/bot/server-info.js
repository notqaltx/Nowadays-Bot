const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('server-info')
        .setDescription('Provides information about the server.'),
    async execute(interaction) {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle(`Server Information - ${guild.name}`)
            .setThumbnail(guild.iconURL({ size: 1024 }))
            .addFields(
                { name: '👑 Owner:', value: `${guild.members.resolve(guild.ownerId)}`, inline: true },
                { name: '📆 Created At:', value: `<t:${Math.round(guild.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '👥 Members:', value: `\`${guild.memberCount.toString()}\` joined members`, inline: true },
                { name: '💬 Text Channels:', value: `\`${guild.channels.cache.filter(c => c.type === 0).size.toString()}\` channels`, inline: true },
                { name: '🔊 Voice Channels:', value: `\`${guild.channels.cache.filter(c => c.type === 2).size.toString()}\` channels`, inline: true },
                { name: '😃 Emojis:', value: `\`${guild.emojis.cache.size.toString()}\` created emojis`, inline: true },
            );
        await interaction.reply({ embeds: [embed] });
    },
};

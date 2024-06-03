const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

const client_utils = require('../../components/client.utils');
const client = client_utils.getClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('ℹ️ Get information about the bot.'),
    async execute(interaction) {
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        const totalChannels = client.channels.cache.size;

        const duration = moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]");
        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('Bot Information')
            .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
            .setDescription(`**LetsBeSocial** is a bot designed for a LBS Official Server. 
                             It currently has over ${client.commands.size} commands!`)
            .addFields(
                { name: '🤖 Bot Name', value: client.user.username, inline: true },
                { name: '👨‍💻 Bot Creator', value: `<@523540249528500224>`, inline: true },
                { name: '💬 Commands', value: `\`${client.commands.size}\` (/) commands`, inline: true },
                { name: '👥 Members', value: `\`${totalMembers}\` members`, inline: true },
                { name: '📺 Channels', value: `\`${totalChannels}\` channels`, inline: true },
                { name: '📅 Created', value: `<t:${Math.round(client.user.createdTimestamp / 1000)}:R>`, inline: true },

                { name: '⬆️ Uptime', value: duration, inline: true },
                { name: '⌛ API Speed', value: `\`${client.ws.ping}\`ms`, inline: true },
                { name: '🏷️ Bot Version', value: `\`${require(`${process.cwd()}/package.json`).version}\``, inline: true },
                { name: '🏷️ Node.js Version', value: `\`${process.version}\``, inline: true },
                { name: '💾 Bot Memory', value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}\` MB`, inline: true },
            );
        await interaction.reply({ embeds: [embed] });
    },
};

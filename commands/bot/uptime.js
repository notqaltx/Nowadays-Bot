const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

const client_utils = require('../../components/client.utils');
const client = client_utils.getClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Check the bot\'s uptime.'),
    async execute(interaction) {
        const duration = moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]");
        const upvalue = Math.floor(Date.now() / 1000 - client.uptime / 1000);

        const embed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle('⬆️ Uptime')
            .setDescription('Bot uptime information:')
            .addFields(
                { name: '⌛ Uptime', value: duration, inline: true },
                { name: '⏰ Up Since', value: `<t:${upvalue}:R>`, inline: true },
            );
        await interaction.reply({ embeds: [embed] });
    },
};

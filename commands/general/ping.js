const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
                .setName('ping')
                .setDescription('this will reply with pong'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};

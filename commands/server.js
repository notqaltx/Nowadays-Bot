const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
                .setName('server')
                .setDescription('This tells more about the server'),
    async execute(interaction) {
        interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members`);
    },
};

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const client_utils = require('../../components/client.utils');
const client = client_utils.getClient();

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Command to show the message with verifying Roblox Account. Only for Administrators.'),
    async execute(interaction) {
       if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) { return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true }); }
       const verificationChannel = client.channels.cache.get(bot.server.verificationChannel);
       if (!verificationChannel) { 
          return interaction.reply({ content: 'Verification channel not found. Please contact an administrator.', ephemeral: true }); 
       }
       if (interaction.channel.id !== bot.server.verificationChannel) {
           if (bot.developer.debug) { log.debug(`${interaction.user.tag} sended a /verify command not into the #verify channel.`); }
           return interaction.reply({ 
               content: `Please use this command in the ${verificationChannel} channel.`, 
               ephemeral: true 
           });
       }
       const verificationComponent = require('../../components/general/verify.main'); 
       verificationComponent(client);
    },
};

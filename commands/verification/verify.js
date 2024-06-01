const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const settings = require('../../configs/settings.json');
const client_utils = require('../../components/client.utils');
const client = client_utils.getClient();

const Logger = require('../../utils/log.util');
const log = new Logger();

require('dotenv').config()
const { VERIFICATION_CHANNEL_ID } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify your LetsBeSocial account!'),
    async execute(interaction) {
       const verificationChannel = client.channels.cache.get(VERIFICATION_CHANNEL_ID);
       if (!verificationChannel) { return interaction.reply({ content: 'Verification channel not found. Please contact an administrator.', ephemeral: true }); }
       if (interaction.channel.id !== VERIFICATION_CHANNEL_ID) {
           if (settings.debug_messages) { log.debug(`${interaction.user.tag} sended a /verify command not into the #verify channel.`); }
           return interaction.reply({ 
               content: `Please use this command in the ${verificationChannel} channel.`, 
               ephemeral: true 
           });
       }
       const verificationComponent = require('../../components/general/verify.main'); 
       verificationComponent(client, interaction);
    },
};

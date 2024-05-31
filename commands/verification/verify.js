const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const client_utils = require('../../components/client.utils');
const client = client_utils.getClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify your LetsBeSocial account!'),
    async execute(interaction) {
      const userEmbed = new EmbedBuilder()
            .setColor('#385EF5')
            .setTitle("Verifying your LetsBeSocial account.")
            .setDescription(`Hello, ${interaction.user.tag}.\n To verify your account you should do these steps:`)
            .addFields(
                { name: 'Step 1:', value: 'Join the **[LetsBeSocial Verification Page](https://www.roblox.com/games/start?launchData=%7B"From"%3A"Verify"%7D&placeId=16366216449)** on Roblox.' },
                { name: 'Step 2:', value: 'Copy the **Verification Code** and send it here.' }
            );
       await interaction.reply({ embeds: [userEmbed], ephemeral: true });
       const verificationComponent = require('../../components/general/verify.main'); 
       verificationComponent(client, interaction);
    },
};

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = async (client) => {
  try {
    const verificationChannel = client.channels.cache.get(bot.server.verificationChannel);
    if (!verificationChannel) {
      log.error('Verification channel not found. Please check the channel ID in your configuration.');
      return;
    }
    const verifyEmbed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle("Nowadays Account Verification")
        .setDescription(`Welcome to the **Account Verification**.\n To verify your Roblox Account you should do these steps:`)
        .addFields(
            { name: 'Step 1:', value: 'Click on the `🟦 Start Verifying` Button below, to follow the **link**.\n\
                After when you\'re opened Verification Page, follow the **instructions**.' },
            { name: 'Step 2:', value: 'When you\'re done with the Verifying on the Verification Page.\n\
                Click on the `✅ Verify` Button, to **finish** your verification.' }
        );
    const verifyButton = new ButtonBuilder()
      .setLabel('🟦 Start Verifying')
      .setURL("https://nowadays.glitch.me/")
      .setStyle(ButtonStyle.Link);

    const checkButton = new ButtonBuilder()
      .setCustomId('check_verification')
      .setLabel('✅ Verify')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(verifyButton, checkButton);
    const messages = await verificationChannel.messages.fetch({ limit: 100 });
    const existingMessage = messages.find(
      (msg) => msg.author.id === client.user.id && msg.embeds[0]?.title === 'Account Verification'
    );
    if (!existingMessage) {
      await verificationChannel.send({ embeds: [verifyEmbed], components: [row] });
      log.info('Verification embed sent.');
    } else {
      log.info('Verification embed already exists.');
    }
  } catch (error) {
    log.error('Error sending verification embed:', error);
  }
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    const { customId, user } = interaction;
    if (customId === 'check_verification') {
      const guild = client.guilds.cache.get(bot.guildId);
      const member = guild.members.cache.get(user.id);

      const role = guild.roles.cache.find(role => role.id === bot.server.roleId);
      if (role && member.roles.cache.has(role.id)) {
        const alreadyVerifiedEmbed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle("You've already verified your **Roblox Account**!");
        return await interaction.reply({ embeds: [alreadyVerifiedEmbed], ephemeral: true });
      }
      await interaction.deferReply({ ephemeral: true });
      try {
        const response = await axios.get(`${bot.developer.oauth.robloxCacheURL}bot/verify`, {
          headers: { 
            'auth-key': bot.developer.oauth.secret,
            'verification-type': "site"
          }
        });
        if (!Array.isArray(response.data)) {
            log.error('API response is not an array:', response.data);
            await interaction.followUp({ 
                content: 'An error occurred during verification. Please try again later.', 
                ephemeral: true 
            });
            return;
        }
        const account = response.data.find(
            (acc) => acc.Discord === user.tag
            && acc.Verified === true
        );
        if (account) {
          if (role && member) {
            await member.roles.add(role);
            if (member.manageable) {
              await member.setNickname(`${member.displayName} (@${account.Roblox})`);
            }
            const successEmbed = new EmbedBuilder()
              .setColor('#16FA4C')
              .setTitle('Verification Successful!')
              .setDescription('Your account has been successfully **verified**!\n\
                And you have been **granted access** to the channels.');
            await interaction.editReply({ embeds: [successEmbed], components: [] });
          } else {
            await interaction.editReply({
              content: 'Could not assign the verified role. Please contact an administrator.',
              components: [],
            });
          }
        } else {
          const notVerifiedEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Not Verified')
            .setDescription('Your account is not verified yet.\n Please complete the **verification** process.');
          await interaction.editReply({ embeds: [notVerifiedEmbed] });
        }
      } catch (error) {
        log.error('Error checking verification status:', error);
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('Error')
          .setDescription('An error occurred while checking your **verification status**. Please try again later.');
        await interaction.editReply({ embeds: [errorEmbed], components: [] });
      }
    }
  });
};

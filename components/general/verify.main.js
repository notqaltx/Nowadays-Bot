const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
      .setURL("https://nowadays.glitch.me/verification")
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
};

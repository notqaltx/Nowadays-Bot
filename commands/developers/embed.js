const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
   data: new SlashCommandBuilder()
      .setName('embed')
      .setDescription('Sends a customized embed')
      .addStringOption(option => 
          option.setName('title')
              .setDescription('Title of the embed')
              .setRequired(true))
      .addStringOption(option => 
          option.setName('description')
              .setDescription('Description of the embed'))
      .addStringOption(option =>
            option.setName('color')
                .setDescription('Color of the embed (hex code like #0099FF)')
                .setRequired(false)),
   async execute(interaction) {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description') || 'No description provided';
      const colorString = interaction.options.getString('color');

      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          if (bot.developer.debug) { log.info(`${interaction.user.tag} do not have a permission to use /embed command.`); }
          return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
      }
      let color = 0x0099FF;
      if (colorString) {
          const hexCode = colorString.startsWith('#') ? colorString.slice(1) : colorString;
          if (/^[0-9A-Fa-f]{6}$/.test(hexCode)) { color = parseInt(hexCode, 16);
          } else {
              if (bot.developer.debug) { log.warn(`${interaction.user.tag} wrote a invalid color code for the /embed command.`); }
              return interaction.reply({ content: 'Invalid color code. Please use a 6-digit hex code (e.g., #0099FF).', ephemeral: true });
          }
      }
      const embed = new EmbedBuilder()
          .setColor(color)
          .setTitle(title)
          .setDescription(description)
          .setTimestamp();
      await interaction.deferReply({ ephemeral: true });
      await interaction.channel.send({ embeds: [embed] }); 
      await interaction.deleteReply(); 
   },
};

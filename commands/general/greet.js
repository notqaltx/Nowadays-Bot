const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('greet')
        .setDescription('Start a greeting conversation!'),
    async execute(interaction) {
        const filter = m => m.author.id === interaction.user.id;
        try {
            let dmChannel = interaction.user.dmChannel;
            if (!dmChannel) {
                dmChannel = await interaction.user.createDM();
            }
            await dmChannel.send('hi!'); 
            const response = await dmChannel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }); 

            if (response.first().content.toLowerCase() === 'hello') {
                await dmChannel.send('How are you doing?');
            } else {
                await dmChannel.send("That's not what I was expecting... but nice to chat with you!");
            }
        } catch (error) {
          if (error.code === 10062) { // Check for "Unknown Interaction" error
              return log.error('Interaction token expired or invalid.');
          } else {
              log.error(`Failed to greet user ${interaction.user.tag}: ${error.message}`); 
              if (!interaction.replied && !interaction.deferred) {
                  await interaction.reply({ content: 'Could not send you a direct message. Please check your DM settings.', ephemeral: true });
              } else {
                  await interaction.followUp({ content: 'Could not send you a direct message. Please check your DM settings.', ephemeral: true });
              }
          }
        }
    },
};

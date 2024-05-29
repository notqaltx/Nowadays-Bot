const fs = require('node:fs');
const { EmbedBuilder } = require('../DiscordUtils');

module.exports = (client, log, moderation) => {
    let bannedWords = [];
    try {
        const data = fs.readFileSync('./configs/banned_words.json');
        const json = JSON.parse(data);
        bannedWords = json.bannedWords;
        log.info(`Loaded ${bannedWords.length} banned words from JSON file.`);
    } catch (err) {
        log.fatal(`Error reading banned_words.json: ${err.message}`);
    }
    client.on('messageCreate', async (message) => {
        const messageContent = message.content.toLowerCase();
        for (const word of bannedWords) {
            const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(escapedWord.replace(/[aeiou]/gi, "[aeiou0-9@]"), "gi");
            if (regex.test(messageContent)) {
                 const originalMessageContent = message.content;
                 message.delete();
         
                 const serverName = message.guild.name;
                 const currentTime = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
         
                 const reportMessageEmbed = new EmbedBuilder()
                     .setColor('#FF0000')
                     .setTitle('New Report!')
                     .setDescription(`${message.author.tag} has been reported for using a banned word.`)
                     .addFields(
                         { name: 'Reported User', value: message.author.tag, inline: true },
                         { name: 'Reason', value: 'Banned Word Usage', inline: true },
                         { name: 'Server', value: serverName, inline: true },
                         { name: 'Time (EST)', value: currentTime, inline: true },
                         { name: 'Original Message', value: originalMessageContent }
                     )
                     .setTimestamp();

                 const reportChannel = client.channels.cache.get(moderation.reportsId);
                 if (reportChannel) {
                     reportChannel.send({ embeds: [reportMessageEmbed] });
                 }
                 const userWarningEmbed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setTitle('Warning')
                    .setDescription(`Your message in **${serverName}** was deleted for containing a variation of the banned word "${word}".\
                         Please review the server rules and avoid using inappropriate language.`)
                    .setTimestamp();
                message.author.send({ embeds: [userWarningEmbed] });
            }
        }
    });
};

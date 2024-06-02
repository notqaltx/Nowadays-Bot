const { Collection } = require('../discord.utils');

module.exports = (client, log, bot) => {
    const userMessageTimestamps = new Collection();
    const warnedUsers = new Set();

    client.on('messageCreate', async (message) => {
        const userId = message.author.id;
        const now = Date.now();
        let timestamps = userMessageTimestamps.get(userId) || [];
        timestamps.push(now);

        const recentTimestamps = timestamps.filter(t => now - t < bot.moderation.timeLimit);
        userMessageTimestamps.set(userId, recentTimestamps);
        if (recentTimestamps.length > bot.moderation.messageLimit) {
           const messagesToDelete = await message.channel.messages.fetch({ limit: bot.moderation.messageLimit + 1 })
                .then(messages => messages.filter(msg => 
                    msg.author.id === userId &&
                    now - msg.createdTimestamp < bot.moderation.timeLimit
                ))
                .catch(error => {
                    log.fatal(`Error fetching messages: ${error}`);
                    return [];
                });
            if (messagesToDelete.size > 0) {
                await message.channel.bulkDelete(messagesToDelete);
                if (!warnedUsers.has(userId)) {
                    const warningMessage = `You are sending messages too quickly. Please slow down.`;
                    try {
                        await message.author.send(warningMessage);
                        log.debug(`Deleted multiple messages from ${message.author.tag} for spamming.`);
                    } catch (error) {
                        log.error(`Failed to DM ${message.author.tag}: ${error}`);
                    }
                    warnedUsers.add(userId);
                    setTimeout(() => {
                        warnedUsers.delete(userId);
                    }, moderation.timeLimit); 
                }
            }
            return;
        }
    });
};

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

let currentActivityIndex = 0;
module.exports = {
    name: 'ready',
    once: true,
    execute(client, ActivityType, PresenceUpdateStatus) {
        const guild = client.guilds.cache.get(bot.guildId);
        if (!guild) {
            log.error(`Guild with ID ${bot.guildId} not found.`);
            return;
        }
        log.info(`Logged in as ${client.user.tag}!`);
        client.user.setStatus(PresenceUpdateStatus.Online);

        updateActivity(client, ActivityType);
        setInterval(() => updateActivity(client, ActivityType), 30 * 1000);
    },
};
function updateActivity(client, ActivityType) {
    const memberCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const activities = [
       { name: `🛡️ Protecting the server`, type: ActivityType.Custom },
       { name: `🧹 Cleaning up chats`, type: ActivityType.Custom },
       { name: `💬 Helping ${memberCount} users`, type: ActivityType.Custom },
    ];
    client.user.setActivity(activities[currentActivityIndex]);
    currentActivityIndex = (currentActivityIndex + 1) % activities.length;
 }

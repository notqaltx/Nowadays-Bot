const { Events } = require('discord.js');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: Events.ShardDisconnect,
    execute(event, id) {
        log.warn(`Shard ${id} disconnected with code ${event.code} at ${new Date()}. Reason: ${event.reason}`);
    },
};

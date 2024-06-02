const { Events } = require('discord.js');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: Events.ShardReconnecting,
    execute(id) {
        log.warn(`Shard ${id} is attempting to reconnect at ${new Date()}...`);
    },
};

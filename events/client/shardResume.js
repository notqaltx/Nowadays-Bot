const { Events } = require('discord.js');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: Events.ShardResume,
    execute(id, replayedEvents) {
        log.info(`Shard ${id} has resumed connection at ${new Date()}. Replayed ${replayedEvents} events.`);
    },
};

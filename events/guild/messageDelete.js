const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: 'messageDelete',
    execute(message) {
        if (bot.developer.debug) {
            if (message.partial) { return; }
            if (message.author.id === message.client.user.id) { return; }
            log.debug(`Message deleted in #${message.channel.name} by ${message.author.tag}: ${message.content}`);
        }
    }
};

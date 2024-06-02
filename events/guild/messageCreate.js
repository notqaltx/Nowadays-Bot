const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (bot.developer.debug) {
            if (message.author.id === message.client.user.id) { return; }
            log.debug(`New message from ${message.author.tag}: ${message.content}`);
        }
    },
};

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: 'error',
    execute(error) {
        if (bot.developer.debug) { log.error(`[ERROR] ${error.name}: ${error.message}`); }
    },
};

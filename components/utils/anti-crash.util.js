const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    init: () => {
        process.on('unhandledRejection', (reason, p) => {
           log.fatal(' [antiCrash] :: Unhandled Rejection/Catch')
           log.error(reason, p)
        })
        process.on('uncaughtException', (err, origin) => {
           log.fatal(' [antiCrash] :: Uncaught Exception/Catch')
           log.error(err, origin)
        })
        process.on('uncaughtExceptionMonitor', (err, origin) => {
           log.fatal(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)')
           log.error(err, origin)
        })
    },
}

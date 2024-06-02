const { Discord, ActivityType, PresenceUpdateStatus } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const bot = require('./configs/bot.config');
const Logger = require('./utils/log.util');
const log = new Logger();

const eventArgsMap = {
   error: ['error'],
   shardDisconnect: ['event', 'id'],
   shardReconnecting: ['id'],
   shardResume: ['id', 'replayedEvents'],
   messageCreate: ['message'],
   messageDelete: ['message'],
   interactionCreate: ['interacion']
};
module.exports = {
   init: (client) => {
      const eventsPath = path.join(__dirname, '../events');
      const eventFolders = fs.readdirSync(eventsPath)
          .filter(file => fs.lstatSync(path.join(eventsPath, file)).isDirectory());

      let loadedEventsCount = 0;
      for (const folder of eventFolders) {
          const eventFiles = fs.readdirSync(path.join(eventsPath, folder)).filter(file => file.endsWith('.js'));
          for (const file of eventFiles) {
              const filePath = path.join(eventsPath, folder, file);
              const event = require(filePath);

              if (!event.name || typeof event.execute !== 'function') {
                  log.warn(`The event at ${filePath} is missing a required "name" or "execute" property.`);
                  continue;
              }
              const args = eventArgsMap[event.name] || [];
              client.on(event.name, (...eventArgs) => {
                  const passedArgs = eventArgs.slice(0, args.length);
                  event.execute(...passedArgs, client, ActivityType, PresenceUpdateStatus);
              });
              if (bot.developer.debugging.show_loaded_events) {
                 log.info(`Loaded event: ${event.name}`);
              }
              loadedEventsCount++;
          }
      }
      if (bot.developer.debug) {
         log.info(`Successfully reloaded ${loadedEventsCount} bot events.`);
      }
   }
};

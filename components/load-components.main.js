const fs = require('node:fs');
const path = require('node:path');

const bot = require('./configs/bot.config');
const Logger = require('./utils/log.util');
const log = new Logger();

module.exports = {
    init: (client) => {
       const componentsPath = path.join(__dirname, '../components');
       const componentFolders = fs.readdirSync(componentsPath).filter(file => fs.lstatSync(path.join(componentsPath, file)).isDirectory());

       let loadedComponentsCount = 0;
       for (const folder of componentFolders) {
           const files = fs.readdirSync(path.join(componentsPath, folder)).filter(file => 
              file.endsWith('.js') && !file.includes('.main') && !file.includes('.utils') && !file.includes('.util') && !file.includes('.config')
           );
           for (const file of files) {
               const filePath = path.join(componentsPath, folder, file);
               try {
                   const component = require(filePath);
                   component(client, log, bot);
                   if (bot.developer.debugging.show_loaded_components) {
                      log.info(`Loaded component: ${file}`);
                   }
                   loadedComponentsCount++;
               } catch (error) {
                   log.error(`Error loading component ${file}: ${error.message}`);
               }
           }
       }
       if (bot.developer.debug) {
          log.info(`Successfully reloaded ${loadedComponentsCount} bot components.`);
       }
    }
};

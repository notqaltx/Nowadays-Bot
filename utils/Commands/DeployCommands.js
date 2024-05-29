const { readdirSync } = require("fs");
const settings = require('../../configs/settings.json');
const Logger = require('../log');
const log = new Logger();

module.exports = (client) => {
  try {
      readdirSync("./commands/").forEach((dir) => {
          const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
          for (let file of commands) {
              try {
                  let pull = require(`../../commands/${dir}/${file}`);
                  if (pull.data && typeof pull.data.name === 'string') {
                      client.commands.set(pull.data.name, pull);
                      if (settings.show_loaded_commands) {
                          log.info(`Loaded Command: ${file}`);
                      }
                  } else {
                      log.error(`Error on Command: ${file} -> missing a data.name, or data.name is not a string.`);
                      continue;
                  }
                  if (pull.aliases && Array.isArray(pull.aliases)) {
                      pull.aliases.forEach((alias) => client.aliases.set(alias, pull.data.name));
                  }
              } catch (e) {
                  log.fatal(String(e.stack));
              }
          }
      });
  } catch (e) {
      log.fatal(String(e.stack));
  }
};

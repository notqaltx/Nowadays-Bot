const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./configs/bot.json');
const log = require('./utils/logger');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}
const rest = new REST({ version: 10 }).setToken(token);

(async () => {
    try {
        log(`Started refreshing ${commands.length} application commands`);
        const data = await rest.put(
            Routes.applicationCommands(clientId, guildId),
            { body: commands },
        );
        log(`Successfully reloaded ${commands.length} application commands`);
    } catch (error) {
        log(error);
    }
})();

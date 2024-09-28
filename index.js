const Discord = require('discord.js');
const { Client, Collection, Routes, REST, GatewayIntentBits } = Discord;

const bot = require('./components/configs/bot.config');
const rest = new REST({ version: 10 }).setToken(bot.token);
const AntiCrash = require('./components/utils/anti-crash.util');
AntiCrash.init();

const LoadCommands = require('./components/commands/deploy-commands.main');
const LoadComponents = require('./components/load-components.main');
const LoadEvents = require('./components/load-events.main');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
const clientUtils = require('./components/client.utils');
clientUtils.setClient(client);

client.commands = new Collection();
client.aliases = new Collection();

// # LOAD COMMANDS, COMPONENTS AND EVENTS
LoadCommands.init( client, rest, Routes );
LoadComponents.init( client );
LoadEvents.init( client );

app.post('/check-discord-user', async (req, res) => {
    const { username } = req.body;
    try {
        const guild = await client.guilds.fetch(bot.guildId);
        const member = guild.members.cache.find(member => member.user.tag === username);
        if (!member) {
            return res.status(404).json({
                errorcode: '4000',
                message: 'User not found in the server'
             });
        }
        return res.status(200).json({ 
            errorcode: '4001',
            message: 'User is in the server', 
            member: member.user 
        });
    } catch (error) {
        console.error('Error fetching member:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})
const listener = app.listen(process.env.PORT, function() {
  console.log("Discord Bot is listening on port " + listener.address().port);
});
client.login(bot.token); 

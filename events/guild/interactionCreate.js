const { Events, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) { 
        if (interaction.isChatInputCommand()) {
            const commandName = interaction.commandName;
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) {
                if (bot.developer.debug) { log.error(`No command matching for ${interaction.commandName} was found.`); }
                return;
            }
            try { await command.execute(interaction, client);
            } catch (error) {
                log.fatal(error);
                if (!interaction.replied && !interaction.deferred) { 
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
        if (interaction.isButton()) {
            const { customId, user } = interaction;
            if (customId === 'check_verification') {
                const guild = client.guilds.cache.get(bot.guildId);
                const member = guild.members.cache.get(user.id);
    
                const role = guild.roles.cache.find(role => role.id === bot.server.roleId);
                if (role && member.roles.cache.has(role.id)) {
                    const alreadyVerifiedEmbed = new EmbedBuilder()
                        .setColor('#0099FF')
                        .setTitle("You've already verified your **Roblox Account**!");
                    return await interaction.reply({ embeds: [alreadyVerifiedEmbed], ephemeral: true });
                }
                await interaction.deferReply({ ephemeral: true });
                try {
                    const response = await axios.get(`${bot.developer.oauth.robloxCacheURL}bot/verify`, {
                    headers: { 
                        'auth-key': bot.developer.oauth.secret,
                        'verification-type': "site"
                    }
                    });
                    if (!Array.isArray(response.data)) {
                        log.error('API response is not an array:', response.data);
                        await interaction.followUp({ 
                            content: 'An error occurred during verification. Please try again later.', 
                            ephemeral: true 
                        });
                        return;
                    }
                    const account = response.data.find(
                        (acc) => acc.Discord === user.tag
                        && acc.Verified === true
                    );
                    if (account) {
                    if (role && member) {
                        await member.roles.add(role);
                        if (member.manageable) {
                            await member.setNickname(`${member.displayName} (@${account.Roblox})`);
                        }
                        const successEmbed = new EmbedBuilder()
                            .setColor('#16FA4C')
                            .setTitle('Verification Successful!')
                            .setDescription('Your account has been successfully **verified**!\n\
                                And you have been **granted access** to the channels.');
                        await interaction.editReply({ embeds: [successEmbed], components: [] });
                    } else {
                        await interaction.editReply({
                            content: 'Could not assign the verified role. Please contact an administrator.',
                            components: [],
                        });
                    }
                    } else {
                    const notVerifiedEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Not Verified')
                        .setDescription('Your account is not verified yet.\n Please complete the **verification** process.');
                    await interaction.editReply({ embeds: [notVerifiedEmbed] });
                    }
                } catch (error) {
                    log.error('Error checking verification status:', error);
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Error')
                        .setDescription('An error occurred while checking your **verification status**. Please try again later.');
                    await interaction.editReply({ embeds: [errorEmbed], components: [] });
                }
            }
        }
    },
};

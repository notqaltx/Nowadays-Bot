const axios = require("axios");
const { Discord, EmbedBuilder } = require('discord.js');

const settings = require('../../configs/settings.json');
const Logger = require('../../utils/log.util');
const log = new Logger();

require('dotenv').config()
const { GUILD_ID, CACHE_SITE_LINK, AUTH_KEY } = process.env;

module.exports = async (client, interaction) => {
    const filter = m => m.author.id === interaction.user.id && m.channel.id === interaction.channel.id; 
    const verificationPromise = new Promise(async (resolve, reject) => {
        const collector = interaction.channel.createMessageCollector({ filter, time: 180000, max: 1 });
        collector.on('collect', async (msg) => {
            try {
                const verificationCode = msg.content.toLowerCase();
                const response = await axios.get(`${CACHE_SITE_LINK}bot/verify`, {
                    headers: { 'auth-key': AUTH_KEY }
                });
                if (!Array.isArray(response.data)) {
                   log.error('API response is not an array:', response.data);
                   await interaction.followUp({ 
                       content: 'An error occurred during verification. Please try again later.', 
                       ephemeral: true 
                   });
                   return reject(new Error('API response is not an array'));
                }
                const account = response.data.find(acc => acc.verificationcode.toLowerCase() === verificationCode);
                if (account) {
                     const guild = client.guilds.cache.get(GUILD_ID);
                     const member = guild.members.cache.get(interaction.user.id);

                     const role = guild.roles.cache.find(role => role.name === "Verified Account");
                     if (role && member.roles.cache.has(role.id)) {
                         const alreadyVerifiedEmbed = new EmbedBuilder()
                             .setColor('#385EF5')
                             .setTitle("You've already verified your **LetsBeSocial** Account!");
                         await interaction.reply({ embeds: [alreadyVerifiedEmbed], ephemeral: true });
                     } else if (role) {
                         await member.roles.add(role);
                         const infoEmbed = new EmbedBuilder()
                             .setColor('#38D65D')
                             .setTitle("Verifying...")
                             .setDescription(`It takes **3-5** seconds to verify.`);
                         await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
                         if (!member) {
                             const errorVerifyingEmbed = new EmbedBuilder()
                                 .setColor('#FF0000')
                                 .setTitle("Error while verifying your account.")
                                 .setDescription(`You're not a LetsBeSocial Discord Server member.\n Please rejoin it and try again.`);
                             await interaction.followUp({ embeds: [errorVerifyingEmbed], ephemeral: true });
                             log.error('Error while verifying user:', interaction.user.tag);
                             return reject(new Error('User is not a guild member'));
                         }
                         const verifiedEmbed = new EmbedBuilder()
                             .setColor('#16FA4C')
                             .setTitle("Successfully verified your LetsBeSocial account!")
                             .setDescription(`You've been successfully verified. Congrats!`);
                         await interaction.followUp({ embeds: [verifiedEmbed], ephemeral: true });
                         log.debug('Verification successful for user:', interaction.user.tag);

                         if (member.manageable) {
                             await member.setNickname(`${account.display} (@${account.user})`);
                         } else {
                             log.warn('Bot does not have permission to change nickname for user:', interaction.user.tag);
                             await interaction.followUp({ 
                              content: 'Verification successful, but I cannot change your nickname due to insufficient permissions.', ephemeral: true 
                             });
                         }
                         if (settings.debug_messages) { log.debug('Verification successful for user:', interaction.user.tag); }
                         resolve();
                     } else {
                         log.warn('Verified Account role not found.');
                         await interaction.followUp({ 
                          content: 'Verification successful, but the Verified Account role was not found.' , ephemeral: true
                         });
                     }
                } else {
                     const invalidCodeEmbed = new EmbedBuilder()
                         .setColor('#FF0000')
                         .setTitle("Invalid verification code. Please try again.");
                     await interaction.reply({ embeds: [invalidCodeEmbed], ephemeral: true });
                     if (settings.debug_messages) {
                         log.error('Invalid verification code when verifying:', interaction.user.tag);
                     }
                     reject();
                }
            } catch (error) {
                if (settings.debug_messages) {
                   log.error('Error during verification:', error);
                }
                const error1Embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle("An error occurred during verification. Please try again later.");
                await interaction.followUp({ embeds: [error1Embed], ephemeral: true });
                reject(error);
            } finally {
                collector.stop();
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
               const timeoutEmbed = new EmbedBuilder()
                   .setColor('#FF0000')
                   .setTitle("Verification Timed Out")
                   .setDescription(`You didn't provide the verification code in time. Please try again.`);
               await interaction.followUp({ embeds: [timeoutEmbed], ephemeral: true });
               if (settings.debug_messages) {
                   log.info('Verification Timed Out for user:', interaction.user.tag);
               }
               reject();
            }
        });
    });
    try {
        await verificationPromise;
    } catch (error) {
        log.error('Error:', error);
        const error2Embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle("A fatal error occurred during verification. Please try again later.");
        await interaction.followUp({ embeds: [error2Embed], ephemeral: true });
    }
};

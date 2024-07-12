const axios = require("axios");
const { EmbedBuilder } = require('discord.js');

const bot = require('../../components/configs/bot.config');
const Logger = require('../../components/utils/log.util');
const log = new Logger();

module.exports = async (client, interaction) => {
     const guild = client.guilds.cache.get(bot.guildId);
     const member = guild.members.cache.get(interaction.user.id);

     const role = guild.roles.cache.find(role => role.name === "Verified Account");
     if (role && member.roles.cache.has(role.id)) {
        const alreadyVerifiedEmbed = new EmbedBuilder()
            .setColor('#0099FF')
            .setTitle("You've already verified your **Roblox** Account!");
        return await interaction.reply({ embeds: [alreadyVerifiedEmbed], ephemeral: true });
     }
     const userEmbed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle("Verifying your Roblox Account.")
        .setDescription(`Hello, **${interaction.user.tag}**.\n To verify your account you should do these steps:`)
        .addFields(
            { name: 'Step 1:', value: `Join the **[Game Verification Page](${bot.developer.oauth.robloxVerificationURL})** on Roblox.\
            \n :warning: Make sure to **not touch anything** when you clicked the link!` },
            { name: 'Step 2:', value: `Copy the **Verification Code** and send it in the <#${bot.channels.verificationChannel}> channel.` }
        );
    await interaction.reply({ embeds: [userEmbed], ephemeral: true });

    const filter = m => m.author.id === interaction.user.id && m.channel.id === bot.channels.verificationChannel; 
    const verificationPromise = new Promise(async (resolve, reject) => {
        const collector = interaction.channel.createMessageCollector({ filter, time: 180000, max: 1 });
        collector.on('collect', async (msg) => {
            try {
                const verificationCode = msg.content;
                const response = await axios.get(`${bot.developer.oauth.robloxCacheURL}bot/verify`, {
                    headers: { 'auth-key': bot.developer.oauth.secret }
                });
                if (!Array.isArray(response.data)) {
                   log.error('API response is not an array:', response.data);
                   await interaction.followUp({ 
                       content: 'An error occurred during verification. Please try again later.', 
                       ephemeral: true 
                   });
                   return reject(new Error('API response is not an array'));
                }
                const account = response.data.find(acc => acc.Code === verificationCode);
                if (account) {
                     if (role) {
                         await msg.delete()
                         await member.roles.add(role);

                         const infoEmbed = new EmbedBuilder()
                             .setColor('#38D65D')
                             .setTitle("Verifying...")
                             .setDescription(`This might take a **few seconds** to verify.`);
                         await interaction.editReply({ embeds: [infoEmbed], ephemeral: true }).then(async message => {
                            if (!member) {
                               const errorVerifyingEmbed = new EmbedBuilder()
                                   .setColor('#FF0000')
                                   .setTitle("Error while verifying your account.")
                                   .setDescription(`You're not a Nowadays Discord Server member.\n Please rejoin it and try again.`);
                               await interaction.followUp({ embeds: [errorVerifyingEmbed], ephemeral: true });
                               log.error('Error while verifying user:', interaction.user.tag);
                               return reject(new Error('User is not a guild member'));
                            }
                            const verifiedEmbed = new EmbedBuilder()
                                .setColor('#16FA4C')
                                .setTitle("Successfully verified your Roblox Account!")
                                .setDescription(`You've been successfully verified. Congrats!`);
                            await interaction.followUp({ embeds: [verifiedEmbed], ephemeral: true });
                         });
                         if (member.manageable) {
                             await member.setNickname(`${account.display} (@${account.user})`);
                         } else {
                             if (bot.developer.debug) {
                                log.warn('Bot does not have permission to change nickname for user:', interaction.user.tag);
                                // await interaction.followUp({ 
                                //    content: 'Verification successful, but I cannot change your nickname due to insufficient permissions.', ephemeral: true 
                                // });
                             }
                         }
                         if (bot.developer.debug) { log.debug('Verification successful for user:', interaction.user.tag); }
                         resolve();
                     } else {
                         await msg.delete();
                         if (bot.developer.debug) {
                            log.warn('Verified Account role not found.');
                            await interaction.editReply({ 
                               content: 'Verification successful, but the Verified Account role was not found.' , ephemeral: true
                            });
                         }
                     }
                } else {
                     await msg.delete();
                     const invalidCodeEmbed = new EmbedBuilder()
                         .setColor('#FF0000')
                         .setTitle("Invalid verification code. Please try again.");
                     await interaction.followUp({ embeds: [invalidCodeEmbed], ephemeral: true });
                     if (bot.developer.debug) {
                         log.warn('Invalid verification code when verifying:', interaction.user.tag);
                     }
                     reject();
                }
            } catch (error) {
                await msg.delete();
                if (bot.developer.debug) {
                   log.error('Error during verification:', error);
                }
                const error1Embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle("An error occurred during verification. Please try again later.");
                await interaction.editReply({ embeds: [error1Embed], ephemeral: true });
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
               await interaction.editReply({ embeds: [timeoutEmbed], ephemeral: true });
               if (bot.developer.debug) {
                   log.warn('Verification Timed Out for user:', interaction.user.tag);
               }
               reject();
            }
        });
    });
    try {
        await verificationPromise;
    } catch (error) {
        log.error('Error:', error);
        // const error2Embed = new EmbedBuilder()
        //     .setColor('#FF0000')
        //     .setTitle("A fatal error occurred during verification. Please try again later.");
        // await interaction.followUp({ embeds: [error2Embed], ephemeral: true });
    }
};

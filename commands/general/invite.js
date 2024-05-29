const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
                .setName('create-invite')
                .setDescription('Creates an invite link for the server.'),
    async execute(interaction) {
        const permissions = interaction.channel.permissionsFor(interaction.client.user);
        if (!permissions.has('CREATE_INSTANT_INVITE')) {
            return interaction.reply("You don't have access to create **invite**!");
        }
        const invite = await interaction.channel.createInvite({
            maxAge: 3600, // in seconds
            maxUses: 1
        });
        return interaction.reply(`Here's your invite link: ${invite.url} \n*You have one hour to use it..(tick, tack)*`);
    },
};

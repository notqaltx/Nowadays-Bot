const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banword')
        .setDescription('Adds or removes a word from the banned words list.')
        .addStringOption(option =>
            option.setName('action')
                .setDescription('The action to perform (add/remove)')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                )
        )
        .addStringOption(option =>
            option.setName('word')
                .setDescription('The word to add or remove')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true
            });
        }
        const action = interaction.options.getString('action');
        const word = interaction.options.getString('word').toLowerCase();

        let bannedWords = [];
        try {
            const data = fs.readFileSync('./configs/banned_words.json');
            const json = JSON.parse(data);
            bannedWords = json.bannedWords;
        } catch (err) {
            log(`Error reading banned_words.json: ${err.message}`);
            return interaction.reply({
                content: 'There was an error reading the banned words file.',
                ephemeral: true
            });
        }
        if (action === 'add') {
            if (bannedWords.includes(word)) {
                return interaction.reply({ content: `Word "${word}" is already banned.`, ephemeral: true });
            }
            bannedWords.push(word);
        } else if (action === 'remove') {
            const index = bannedWords.indexOf(word);
            if (index === -1) {
                return interaction.reply({ content: `Word "${word}" is not in the banned list.`, ephemeral: true });
            }
            bannedWords.splice(index, 1);
        }
        fs.writeFileSync('./configs/banned_words.json', JSON.stringify({ bannedWords }));
        return interaction.reply({
            content: `Word "${word}" ${action === 'add' ? 'added to' : 'removed from'} the banned words list.`,
            ephemeral: true
        });
    },
};

// Require the SlashCommandBuilder class
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('secret-ping')
        .setDescription('Secretely replies with Pong'),
    async execute(interaction) {
        // Only the executor of the command can see the response
        await interaction.reply({ content: 'secret pong!', ephemeral: true });
    }
}
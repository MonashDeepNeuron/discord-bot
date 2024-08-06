// Require the SlashCommandBuilder class
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('double-ping')
        .setDescription('Replies with Pong twice'),
    async execute(interaction) {
        await interaction.reply('pong!');
        await interaction.followUp('double pong!');
    }
}
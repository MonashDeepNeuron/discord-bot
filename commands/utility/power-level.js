// Require the SlashCommandBuilder class
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// This command can only be executed if the user possesses the manage server permission
module.exports = {
    data: new SlashCommandBuilder()
        .setName('power-level')
        .setDescription('Checks your power level')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        await interaction.reply('over 9000!');
    }
}
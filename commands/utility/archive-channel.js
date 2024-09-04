const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
const { archiveId, clientId } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('archive-channel')
        .setDescription('Archives a channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        
        // Get the channel
        .addChannelOption(option => 
        option.setName('channel')
            .setDescription('Channel to archive')
            .setRequired(true)),


    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        
        try {
            // Update permissions to only allow bot to see
            await channel.permissionOverwrites.set([
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: clientId,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                }
            ]);

            await channel.setParent(archiveId); // Move channel
            // Remove bot's permissions
            // await channel.permissionOverwrites.edit(clientId, { ViewChannel: false });
            
            await interaction.reply(`<#${channel.id}> was archived successfully`);

        } catch (error) {
            console.error(error);
        	await interaction.reply( {content: 'There was an error archiving this channel.', ephemeral: true } );
        }
    }
}
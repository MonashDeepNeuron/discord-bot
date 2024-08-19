const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField, roleMention, channelMention } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-private-channel')
        .setDescription('Create a new private channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) 
        
        // Get the channel name
        .addStringOption(option =>
        option.setName('channel-name')
            .setDescription('Name of the new channel')
            .setRequired(true)
            .setMaxLength(25) // Max channel name length that can be displayed
        )
        
        .addRoleOption(option => 
        option.setName('role')
            .setDescription("Role that the channel is visible to")
            .setRequired(true)
        ),

    async execute(interaction) {
        const channelName = interaction.options.getString('channel-name');
        const allowedRole = interaction.options.getRole('role');

        // Create object with channel data
        const newChannel = {
            name: channelName, 
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: allowedRole.id,
                    allow: [PermissionsBitField.Flags.ViewChannel],
                }
            ],
        };

        try {
            // Ternary expression is used instead of if-else so that createdChannel isn't restricted to block scope
            const createdChannel = !interaction.channel.parent ?
                await interaction.guild.channels.create(newChannel) : // If command was run in a stray channel
                await interaction.channel.parent.children.create(newChannel); // Otherwise create the channel in the same category
            await interaction.reply({
                content: `The private channel ${channelMention(createdChannel.id)} has been created, viewable only to ${roleMention(allowedRole.id)}.`,
                ephemeral: false 
            });
            
        } catch (error) {
        	console.error(error);
        	await interaction.reply( {content: 'There was an error creating this private channel.', ephemeral: true } );
      	}
    },
}
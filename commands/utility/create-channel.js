const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-channel')
        .setDescription('Create a new channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels) 
        
        // Get the channel name
        .addStringOption(option =>
        option.setName('channel-name')
            .setDescription('Name of the new channel')
            .setRequired(true)
            .setMaxLength(25) // Max channel name length that can be displayed
        ),

    async execute(interaction) {
        const channelName = interaction.options.getString('channel-name');
        // Create object with channel data
        const newChannel = {
            name: channelName, 
            type: ChannelType.GuildText,
        };

        try {
            // Ternary expression is used instead of if-else so that createdChannel isn't restricted to block scope
            const createdChannel = !interaction.channel.parent ?
                await interaction.guild.channels.create(newChannel) : // If command was run in a stray channel
                await interaction.channel.parent.children.create(newChannel); // Otherwise create the channel in the same category
            await interaction.reply( {content: `The channel <#${createdChannel.id}> has been created.`, ephemeral: false } );
            
        } catch (error) {
        	console.error(error);
        	await interaction.reply( {content: 'There was an error creating this channel.', ephemeral: true } );
      	}
    },
}
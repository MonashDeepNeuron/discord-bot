const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start-project')
        .setDescription('Create a new channel and role for a project.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageRoles) 
        
        // Get the channel name
        .addStringOption(option =>
        option.setName('project-name')
            .setDescription('Name of the new channel')
            .setRequired(true)
            .setMaxLength(30) // Max channel name length that can be displayed
        )
        
        // Get the colour of the role
        .addStringOption(option => 
        option.setName('colour')
            .setDescription('Hex color code (e.g: #3E99C6) for the role')
            .setRequired(false)
            .setMinLength(7)
            .setMaxLength(7)
        ),

    async execute(interaction) {
        // Get user arguments
        const name = interaction.options.getString('project-name');
        const color = interaction.options.getString('colour') ?? '#FFFFFF';
        const guild = interaction.guild;

        // Validate color input using regular expression
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
            return interaction.reply({ content: 'Invalid colour code. Please provide a valid hex colour code (e.g., #FF5733).', ephemeral: true });
        }

        try {
            // Create role
            const createdRole = await guild.roles.create({
                name, 
                permissions: [PermissionsBitField.Flags.SendMessages],
                mentionable: true,
                color,
            })

            // Create object with channel data
            const newChannel = {
                name, 
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: createdRole.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    }
                ],
            };

            // Create the channel
            const createdChannel = !interaction.channel.parent ?
                await interaction.guild.channels.create(newChannel) : // If command was run in a stray channel
                await interaction.channel.parent.children.create(newChannel); // Otherwise create the channel in the same category

            await interaction.reply(`The project **${name}** has been created, ` + 
                                    `with private channel <#${createdChannel.id}> ` +
                                    `and role <@&${createdRole.id}>!`);
            
        } catch(error) {
            console.error(error);
        	await interaction.reply( {content: 'There was an error creating this project.', ephemeral: true } );
      	}
    }
}
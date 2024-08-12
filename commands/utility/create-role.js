// Require the SlashCommandBuilder class
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-role')
        .setDescription('Create a role for the server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        
        // Get the role name
        .addStringOption(option =>
        option.setName('role-name')
            .setDescription('Name of the role')
            .setRequired(true)
        )
        
        // Get the colour of the role
        .addStringOption(option => 
        option.setName('colour')
            .setDescription('Hex color code (e.g: #3E99C6)')
            .setRequired(false)
            .setMinLength(7)
            .setMaxLength(7)),

    
    async execute(interaction) {
        // Get parameters from interaction
        const guild = interaction.guild;
        const roleName = interaction.options.getString('role-name');
        const colour = interaction.options.getString('colour') ?? '#FFFFFF'

        // Validate color input using regular expression
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(colour)) {
            return interaction.reply({ content: 'Invalid colour code. Please provide a valid hex colour code (e.g., #FF5733).', ephemeral: true });
        }

        try {
			const createdRole = await guild.roles.create({
                name: roleName, 
                permissions: [PermissionsBitField.Flags.SendMessages],
                mentionable: true,
                color: colour,
            })
			await interaction.reply( {content: `The role <@&${createdRole.id}> has been created.`, ephemeral: false } );
      	} catch (error) {
        	console.error(error);
        	await interaction.reply( {content: 'There was an error creating this role.', ephemeral: true } );
      	}
    },
}
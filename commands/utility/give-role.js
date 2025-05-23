const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('give-role')
    	.setDescription('Give a user a role')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)

    	// Get input for which user to give role to
    	.addUserOption(option =>
        option.setName('user')
        	.setDescription('The user to give the role to.')
        	.setRequired(true)
		)

		// Get input for which role to give
    	.addRoleOption(option =>
        option.setName('role')
        	.setDescription('The role to give to the user.')
        	.setRequired(true)
		),
			
    async execute(interaction) {
    	const member = interaction.options.getMember('user');
    	const role = interaction.options.getRole('role');
  
		try {
			await member.roles.add(role);
			await interaction.reply( {content: `The role **${role.name}** has been added to **${member.user.username}**.`, ephemeral: false } );
      	} catch (error) {
        	console.error(error);
        	await interaction.reply( {content: 'There was an error giving the role.', ephemeral: true } );
      	}
    },
};
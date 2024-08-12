const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('remove-role')
    	.setDescription('Remove a role from a user')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)

    	// Get input for which user to remove role from
    	.addUserOption(option =>
        option.setName('user')
        	.setDescription('The user to remove the role from.')
        	.setRequired(true))
		
		// Get input for which role to remove
    	.addRoleOption(option =>
        option.setName('role')
        	.setDescription('The role to remove from the user.')
        	.setRequired(true)),
			
    async execute(interaction) {
    	const guild = interaction.guild;
    	const member = guild.members.cache.get(interaction.options.getUser('user').id);
    	const role = interaction.options.getRole('role');
  
		try {
			await member.roles.remove(role);
			await interaction.reply( {content: `The role ${role.name} has been removed from ${member.user.username}.`, ephemeral: false } );
      	} catch (error) {
        	console.error(error);
        	await interaction.reply( {content: 'There was an error removing the role.', ephemeral: true } );
      	}
    },
};
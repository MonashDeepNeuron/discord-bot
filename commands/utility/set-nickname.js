const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    	.setName('set-nickname')
    	.setDescription("Change a user's nickname")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)

    	// Get input for which user to change nickname
    	.addUserOption(option =>
        option.setName('user')
        	.setDescription('The user to be nicknamed.')
        	.setRequired(true)
		)

		// Get input for nickname to give
    	.addStringOption(option =>
        option.setName('nickname')
        	.setDescription('The nickname to give.')
        	.setRequired(true)
		),
			
    async execute(interaction) {
    	const member = await interaction.options.getMember('user');
    	const nickname = await interaction.options.getString('nickname');
  
		try {
			await member.setNickname(nickname);
			await interaction.reply( {content: `The nickname **${nickname}** has been given to to <@${member.user.id}>.`, ephemeral: false } );
      	} catch (error) {
        	console.error(error);
        	await interaction.reply( {content: 'There was an error giving the nickname.', ephemeral: true } );
      	}
    },
};
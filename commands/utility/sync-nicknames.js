const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getNotionNames } = require('../../notion');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sync-nicknames')
		.setDescription('Sync server nicknames with preferred names from Notion')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

	async execute(interaction) {
        // Defer reply since we don't know how long Notion API call will take
		await interaction.deferReply();

		const guild = interaction.guild;
		const notionUsers = await getNotionNames();
        
		let updated = 0, skipped = 0;

		// Preload all server members
		const members = await guild.members.fetch();

		for (const { discordUsername, preferredName } of notionUsers) {
            // Check if either field is empty, if yes, skip
			if (!discordUsername || !preferredName) {
				skipped++;
				continue;
			}

            // Skip if username could not be found
			const member = members.find(m => m.user.tag === discordUsername);
			if (!member) {
				skipped++;
				continue;
			}

            // Set nickname
			try {
				await member.setNickname(preferredName);
				updated++;
			} catch (error) {
				console.warn(`Failed to set nickname for ${discordUsername}: ${error}`);
				skipped++;
			}
		}

		await interaction.editReply(`Updated **${updated}** nicknames. Skipped **${skipped}** entries.`);
	},
};

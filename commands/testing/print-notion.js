const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { getUsersFromNotion } = require('../../notion');

// Dangerous command - prints entire database, so do not use on actual database
module.exports = {
	data: new SlashCommandBuilder()
		.setName('print-notion')
		.setDescription('Print all entries from the Notion database')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		try {
			const users = await get();
		} catch (err) {
			console.error('Failed to fetch from Notion:', err);
			return interaction.editReply('❌ Error fetching data from Notion.');
		}

		if (!users.length) {
			return interaction.editReply('⚠️ No users found in the Notion database.');
		}

		const entries = users
			.map((u, i) => `**${i + 1}.** \`${u.discordUsername || 'N/A'}\` → **${u.preferredName || 'N/A'}**`)
			.join('\n');

		const embed = new EmbedBuilder()
			.setTitle('📝 Notion User List')
			.setDescription(entries.slice(0, 4000)) // Discord embed limit
			.setColor(0x3498db)
			.setTimestamp();

		await interaction.editReply({ embeds: [embed] });
	},
};

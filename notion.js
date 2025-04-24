// Imports and exports
const { Client } = require('@notionhq/client');
const { notionToken, notionDatabaseId } = require('./config.json');
module.exports = { getNotionNames };

// Create notion client with token
const notion = new Client({ auth: notionToken });

// Get names and discord usernames column from database
async function getNotionNames() {
    // Query page using database ID
	const databaseId = notionDatabaseId;
	const response = await notion.databases.query({ database_id: databaseId });

    // Return username and name columns
	return response.results.map(page => {
		const props = page.properties;
		return {
			discordUsername: props['Discord Username'].rich_text[0]?.plain_text,
			preferredName: props['Name'].rich_text[0]?.plain_text
		};
	});
}


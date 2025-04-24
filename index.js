const fs = require('node:fs'); // Node file system module, used to read `commands` directory
const path = require('node:path'); // Node path utility module, helps to construct paths to access files

// Require discord.js classes and bot token
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { discordToken } = require('./config.json');

// Create the client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
client.commands = new Collection();

// Get the path to the commands folder and gets an array of all folders inside
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

// Loop through all of the folders in commandFolders
for (const folder of commandFolders) {

    // Construct the path and read the filenames in the folder into commandFiles
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Remove non js files

    // Loop through each file in the folder
	for (const file of commandFiles) {
        // Construct the file path and read the file
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
            // Make sure empty or incomplete commands aren't loaded
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Create a listener for events to execute when an interaction is received
client.on(Events.InteractionCreate, async interaction => {
    // Ensure only slash commands are handled
	if (!interaction.isChatInputCommand()) return; 

    // Get the command matching the command name, exit if none is found
    const command = interaction.client.commands.get(interaction.commandName);
    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found :(`);
        return;
    }

    // Try to execute the command
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
});

// When the client is ready, run this code once
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(discordToken)
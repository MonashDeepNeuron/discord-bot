# discord-bot
Discord bot for MDN discord server.
Requires node v18+, run `npm install` to get required modules.

Run `node ./index.js` to start the application.

If a slash command is added/removed or any command **data** is modified (i.e. name, description, parameters), then run `node ./deploy_commands.js` to sync this information with the development server on Discord. Use the `-global` flag to deploy these commands globally (to every Discord server the bot is in).

## Config File
The bot will need a *config.json* file in the root of the folder, in the following form:
```json
{
    "discordToken": "insert-discord-token",
    "clientId": "insert-client-id",
    "guildId": "insert-guild-id",
    "notionToken": "insert-notion-token",
    "notionDatabaseId": "insert-database-id"
}
```
See [Configuration files](https://discordjs.guide/creating-your-bot/#configuration-files) for information on getting the Bot ***discordToken***. 
Also see [Guild commands](https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands) for where to find the ***clientId*** and ***guildId***, where the guild is the development server of the bot.  
See [Notion integrations](https://www.notion.so/my-integrations) on how to create and find the ***notionToken***. 
The part of the URL after the slash and before the question mark (if there is one) is the ***notionDatabaseId***. For example: notion.so/**DATABASE_ID**?v=0d1b22


## Bot Permissions
The bot will require the `bot` and `application.commands` scopes to function properly (see [here](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#creating-and-using-your-invite-link) for more info), as well as the following permissions in the Discord server:
- Manage Channels
- Manage Roles
- Manage Nicknames
- Mention Everyone
- Use Application Commands

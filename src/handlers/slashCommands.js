const { DISCORD_API_URL } = require("../config/config.json")
const axios = require("axios")

class SlashCommandManager {
    constructor(token) {
        this.token = token;
    }

    async registerSlashCommand(commandData, client_id) {
        const url = `${DISCORD_API_URL}/applications/${client_id}/commands`;

        try {
            const response = await axios.post(url, commandData, {
                headers: {
                    Authorization: `Bot ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('An error occurred while registering slash command:', error.message);
            throw error;
        }
    }

    async executeInteraction(callback) {
        // Discord API will send interactions to this endpoint
        // Here you would handle the interaction and execute the provided callback
        console.log("slashCommands.js - callback")
        console.log(callback)

        return callback
    }
}

module.exports = SlashCommandManager
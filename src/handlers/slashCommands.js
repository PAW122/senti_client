const { DISCORD_API_URL } = require("../config/config.json")
const axios = require("axios")
const slashCollection = require("../modules/slahsColection")

class SlashCommandManager {
    constructor(token) {
        this.token = token;
        this.slash_Collection = new slashCollection();
        global.slashCollection = this.slash_Collection;
    }

    //TODO: po wywołaniu automatycznie dodawaj nazwe komendy do listy senti.slashcommands
    async registerSlashCommand(commandData, client_id) {
        const url = `${DISCORD_API_URL}/applications/${client_id}/commands`;

        //save new command
        this.slash_Collection.add(commandData.name, commandData)

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
    async executeInteraction(interactionData) {
    
    }

}

module.exports = SlashCommandManager
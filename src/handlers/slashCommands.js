const { DISCORD_API_URL } = require("../config/config.json")
const axios = require("axios")
const slashCollection = require("../modules/slahsColection")

/**
 * easy way to register slash command
 */
class SlashCommandManager {
    constructor(token) {
        this.token = token;
        this.slash_Collection = new slashCollection();
        global.slashCollection = this.slash_Collection;
    }

    /**
     * 
     * @returns {Promise} - slashCollection object
     */
    async getCollection() {
        return this.slash_Collection
    }

    /**
     * register new command
     * @param {JSON} commandData 
     * @param {string} client_id 
     * @returns {response} - res.data
     */
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

    /**
     * register new command for a specific guild
     * @param {JSON} commandData 
     * @param {string} client_id 
     * @param {string} guild_id 
     * @returns {response} - res.data
     */
    async registerGuildSlashCommand(commandData, client_id, guild_id) {
        const url = `${DISCORD_API_URL}/applications/${client_id}/guilds/${guild_id}/commands`;

        // Save new command
        this.slash_Collection.add(commandData.name, commandData);

        try {
            const response = await axios.post(url, commandData, {
                headers: {
                    Authorization: `Bot ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            return response.data;
        } catch (error) {
            console.error('An error occurred while registering guild slash command:', error.message);
            throw error;
        }
    }


}

module.exports = SlashCommandManager
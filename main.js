const axios = require("axios");

async function senti_client(token) {
    return connect(token)
}

module.exports = senti_client;

async function connect(token) {

    if(!token) {
        throw new Error("token is undefind")
    }

    const DISCORD_API_URL = 'https://discord.com/api/v9';
    const response = await axios.get(`${DISCORD_API_URL}/users/@me`, {
        headers: {
            Authorization: `Bot ${token}`,
        },
    });
    return response.data;
}
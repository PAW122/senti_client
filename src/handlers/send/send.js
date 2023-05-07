const { DISCORD_API_URL } = require("../../config/config.json")

const axios = require("axios");

async function send(token, channelId, message) {
    const url = `${DISCORD_API_URL}/channels/${channelId}/messages`;

    if (!channelId || isNaN(channelId)) {
        throw new Error("channel id is undefind. \n example: \n senti.send('<channel_id>','<message>');")
    }

    if (!message) {
        throw new Error("message is undefind. \n example: \n senti.send('<channel_id>','<message>');")
    }

    if(!token) {
        throw new Error("token is undefind.\nyou are probably trying to use the send function before logging in.")
    }

    try {
        const response = await axios.post(
            url,
            { content: message },
            {
                headers: {
                    Authorization: `Bot ${token}`,
                },
            }
        );

        console.log(`Message sent: ${response.data.content}`);
    } catch (error) {
        console.error(error);
    }
}

module.exports = send;
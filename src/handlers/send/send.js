const { DISCORD_API_URL } = require("../../config/config.json")
const sendApi = require("../../modules/APILimiter")

/**
 * send message (put)
 * @param {token} token - bot token
 * @param {string} channelId - channel id
 * @param {string} message - message content
 * @param {emoji} reaction - optional
 * @returns {response} - discord API response
 */
async function send(token, channelId, message, reaction) {
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
        let data = {
            content: message
        }
        const response = await sendApi(token,url, data);

        //add reaction:
        if (reaction) {
            const messageId = response.data.id;
            const reactionUrl = `${DISCORD_API_URL}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(reaction)}/@me`;
            data = {}

            let options = {
                type: "put"
            }
            var response2 = await sendApi(token,reactionUrl,data,options);
        }

        return response, response2 || null

    } catch (error) {
        console.error(error);
    }
}

module.exports = send;
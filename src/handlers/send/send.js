const { DISCORD_API_URL } = require("../../config/config.json")
const sendApi = require("../../modules/APILimiter")

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
            console.log(`sendjs add reaction data: ${data}, reactionUrl: ${reactionUrl}, messageId: ${messageId}, reaction: ${reaction}`)
            let options = {
                type: "put"
            }
            await sendApi(token,reactionUrl,data,options);
        }

    } catch (error) {
        console.error(error);
    }
}

module.exports = send;
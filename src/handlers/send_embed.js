const { DISCORD_API_URL } = require("../config/config.json");
const sendApi = require("../modules/APILimiter")

async function sendWithEmbed(token, channelId, embed, reaction) {

  const url = `${DISCORD_API_URL}/channels/${channelId}/messages`;
  let data = {
    embeds: [embed]
  }
  const response = await sendApi(token, url, data)

  if (reaction) {
    const messageId = response.data.id;
    const reactionUrl = `${DISCORD_API_URL}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(reaction)}/@me`;
    let options = {
      type: "put"
    }
    data = {}
    sendApi(token, reactionUrl, data, options)
  }
}

module.exports = sendWithEmbed;

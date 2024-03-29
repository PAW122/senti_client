const { DISCORD_API_URL } = require("../config/config.json")
const sendApi = require("../modules/APILimiter")

/**
 * Adds a reaction to a message in a Discord channel
 * @param {string} token - Discord bot token
 * @param {string} channelId - ID of the channel the message is in
 * @param {string} messageId - ID of the message to add the reaction to
 * @param {string} reaction - Unicode emoji or custom emoji ID in the format <:name:id>
 * @returns {Promise} - Promise that resolves with the response data from the API
 */
async function addReaction(token, channelId, messageId, reaction) {
  if (!channelId) throw new Error("addReaction channel_id not specified")
  if (!messageId) throw new Error("addReaction messageId not specified")
  if (!reaction) throw new Error("addReaction reaction not specified")
  try {
    let url = `${DISCORD_API_URL}/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(reaction)}/@me`
    let data = {}
    let options = {
      type: "put"
    }
    const response = await sendApi(token, url, data, options)
    if (response.status && response.status == 204) console.log(response.statusText)
    return response.data;

  } catch (error) {
    console.error(`> an error occurred while adding the reaction: ${error}`);
    return error
  }
}

module.exports = addReaction;
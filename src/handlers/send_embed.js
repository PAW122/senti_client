const axios = require("axios");
const { DISCORD_API_URL } = require("../config/config.json");

async function sendWithEmbed(token, channelId, embed) {
  const url = `${DISCORD_API_URL}/channels/${channelId}/messages`;

  try {
    const response = await axios.post(
      url,
      { embeds: [embed] },
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

module.exports = sendWithEmbed;

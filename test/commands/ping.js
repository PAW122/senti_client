const senti = require("senti_client");

module.exports = {
    name: "ping",

    execute: async (message, args,senti) => {
        const channel_id = message.channel_id
        senti.send(channel_id, "Pong!");
    }

}
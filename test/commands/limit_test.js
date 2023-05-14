const { EmbedMessage } = require("senti_client");

module.exports = {
    name: "reaction",

    execute: async (message, args, senti) => {

        const channel_id = "745768777022701648"

        let i = 0;
        while (i < 10) {
            i++
            senti.send(channel_id, `wiadomość: ${i}/10`)
        }
    }
}

/*
    w każdym przypadku trzeci argument jest emotką którą można dodać do wiadomości
*/
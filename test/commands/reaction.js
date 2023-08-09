module.exports = {
    name: "reaction",

    execute: async (message, args,senti) => {

        //add reaction with message
        senti.send(message.channel_id, "Pong!", "✅");


        //add reaction to message
        senti.addReaction(message.channel_id, message.id, "❤");
    }

}
module.exports = {
    name: "ping",

    execute: async (message, args,senti) => {

        senti.send(message.channel_id, "Pong!");
        
    }

}
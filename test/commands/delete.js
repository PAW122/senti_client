const { EmbedMessage } = require("senti_client")

module.exports = {
    name: "delete",

    execute: async (message, args, senti) => {

        //TODO: not working us expected

        if(args[0] == "help") {
            help_embed = new EmbedMessage()
            .setTitle("delete help page")
            .setFields(
                {name: "usage", value: ">delete <message id>"}
            )
        }

        console.log(args)
        
        //number
        if(args && !isNaN(args[0])) {
            const message_id = args[0]
            senti.MESSAGE_DELETE(message.channel_id,message_id)
            senti.send(message.channel_id, "pomyślnie usunięto wiadomość")
        }
    
    }

}
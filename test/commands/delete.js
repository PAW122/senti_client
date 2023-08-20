const { EmbedMessage } = require("senti_client")

module.exports = {
    name: "delete",

    execute: async (message, args, senti) => {

        //TODO: not working us expected

        if(args[0] == "help") {
            help_embed = new EmbedMessage()
            .setTitle("delete help page")
            .setFields(
                {name: "usage", value: ">delete <message id>"},
                {name: "delete multiple messages", value: ">delete multiple <number of messages to delete>"}
            )
        }

        console.log(args)

        if(args[0] == "multiple" && !isNaN(args[1])) {

            const messages = await senti.get_messages(message.channel_id, args[1])

            senti.MESSAGE_DELETE_BULK(message.channel_id, messages).then( () => {
                senti.send(message.channel_id, `pomyślnie usunięto ${args[1]} wiadomośći`)
            })
        }
        
        //number
        else if(args && !isNaN(args[0])) {
            const message_id = args[0]
            senti.MESSAGE_DELETE(message.channel_id,message_id, message.guild.id)
            senti.send(message.channel_id, "pomyślnie usunięto wiadomość")
        }
    }

}
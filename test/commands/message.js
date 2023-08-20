module.exports = {
    name: "message",

    execute: async (message, args, senti) => {

        if (args[0] == "delete") {
            senti.MESSAGE_DELETE(
                "745768777022701648",//channel_id
                "1138942993601155103"//message_id
            )
        }

        else if (args[0] == "edit") {
            senti.MESSAGE_UPDATE(
                "745768777022701648",//channel_id
                "1139586581603291288",//message_id
                "new edited message"//new message content
            )
        }

        else if (args[0] == "send") {
            senti.send(
                "745768777022701648",//channel_id
                "hello world"//message content
            )
        }
    }
}
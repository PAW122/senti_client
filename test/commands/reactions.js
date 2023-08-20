module.exports = {
    name: "reactions",

    execute: async (message, args, senti) => {

        if (args[0] == "remove_emoji") {

            senti.MESSAGE_REACTION_REMOVE_EMOJI(
                "745768777022701648",//channel_id
                "1139315421133152408",//message_id
                "✅"//emoji
            )
        }

        else if (args[0] == "remove_all") {
            senti.MESSAGE_REACTION_REMOVE_ALL(
                "745768777022701648",//channel_id
                "1139315421133152408"//message_id
            )
        }

        else if (args[0] == "remove_reaction") {

            senti.MESSAGE_REACTION_REMOVE(
                "745768777022701648",//channel_id
                "1139315421133152408",//message_id
                "✅"//reaction
            )
        }

        else if (args[0] == "add_reaction") {

            senti.MESSAGE_REACTION_ADD(
                "745768777022701648",//channel_id
                "1139315421133152408",//message_id
                "✅"//reaction
            )
        }

    }
}
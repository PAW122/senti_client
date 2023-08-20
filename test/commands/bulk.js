module.exports = {
    name: "ping",

    execute: async (message, args, senti) => {

        senti.MESSAGE_DELETE_BULK(
            "745768777022701648",//channel_id

            //list of messages id to be deleted
            ["1142614799964971038",
                "1142614805665042484",
                "1142614811444772894"]
        )

    }

}
module.exports = {
    name: "ban",

    execute: async (message, args, senti) => {

        //start typing on channel
        const channel_id = "745768777022701648"
        senti.TYPING_START(channel_id)
    }
}
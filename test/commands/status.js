module.exports = {
    name: "status",

    execute: async (message, args, senti) => {

        const bot_status = "offline"
        senti.PRESENCE_UPDATE(senti.user.id, bot_status)
    }
}
module.exports = {
    name: "channel_delete",


    execute: (message, args, senti) => {
        const channel_id = "1086447863808151603"
        senti.CHANNEL_DELETE(channel_id)
    }
}
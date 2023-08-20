module.exports = {
    name: "invite_create",

    execute: async (message, args, senti) => {
        const channel_id = "745768777022701648"

        senti.INVITE_CREATE(channel_id, 10, 1000)
            .then(res => {
                senti.send(channel_id, `https://discord.gg/${res.code}`)
            })
    }
}
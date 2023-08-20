module.exports = {
    name: "invite_create",

    execute: async (message, args, senti) => {
        const invite_code = "B6FebeJk"
        senti.INVITE_DELETE(invite_code)
    }
}
module.exports = {
    name: "channel_create",

    execute: async(message,args,senti) => {
        const channel_data = {
            name: 'New Channel Name',
            type: 0 // Channel type (0 means text, 2 means voice)
        };

        const guild_id = "727662119553728532";

        senti.CHANNEL_CREATE(guild_id, channel_data)
    }
}
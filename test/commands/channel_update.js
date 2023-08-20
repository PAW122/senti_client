module.exports = {
    name: "channel_update",

    execute: async(message,args,senti) => {
        const updated_data = {
            name: 'New Channel Name'
        };
        const channel_id = "1086447865066442823";

        senti.CHANNEL_UPDATE(channel_id, updated_data)
    }
}
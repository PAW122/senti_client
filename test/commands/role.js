module.exports = {
    name: "role",

    execute: async (message, args, senti) => {

        //remember to replace the data like
        //channel_id, role_id, guild_id with your server's data

        //role_delete
        if (args[0] == "role_delete") {
            const guild_id = "727662119553728532"
            const role_id = "1140089406242426930"
            senti.GUILD_ROLE_DELETE(guild_id, role_id)
        }

        //role_update
        else if (args[0] == "role_update") {
            const updated_role_data = {
                name: 'Test Role Updated',
                color: 0x00ff00,
                permissions: 1234567890
            };

            const guild_id = "727662119553728532"
            const role_id = "1140089406242426930"

            senti.GUILD_ROLE_UPDATE(guild_id, role_id, updated_role_data)
        }

        //make_role
        else if (args[0] == "make_role") {
            const role_data = {
                name: 'Test Role Name',
                color: 0x00ff00,
                permissions: 1234567890
            };

            const guild_id = "727662119553728532"

            senti.GUILD_ROLE_CREATE(guild_id, role_data)
        } else {
            senti.send(message.channel_id, "try: **role role_delete**\n**role role_update**\n**role make_role**")
        }

    }
}
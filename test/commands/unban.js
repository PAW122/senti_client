module.exports = {
    name: "unban",

    execute: async (message, args, senti) => {

        const guild_id = '727662119553728532';
        const user_id = '778643150981562368';

        senti.getFullUserInfo(user_id)
            .then(user => {
                senti.GUILD_BAN_REMOVE(guild_id, user)
                    .catch(error => {
                        console.error("There was an error removing the ban:", error.message);
                    });
            })
            .catch(error => {
                console.error("There was an error retrieving user information:", error.message);
            });

    }

}
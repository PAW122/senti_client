module.exports = {
    name: "ban",

    execute: async (message, args, senti) => {

        const guild_id = '727662119553728532';
        const user_id = '778643150981562368';

        senti.getFullUserInfo(user_id)
            .then(user => {
                senti.GUILD_BAN_ADD(guild_id, user)
                    .catch(error => {
                        console.error("There was an error adding a ban:", error.message);
                    });
            })
            .catch(error => {
                console.error("There was an error retrieving user information:", error.message);
            });
    }
}
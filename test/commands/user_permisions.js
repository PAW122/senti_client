module.exports = {
    name: "permissions",

    execute: async (message, args, senti) => {
        if (args[0] === "help") {
            senti.send(message.channel_id, "permissions help page.\nUsage: **>permissions <user_id>**");
            return;
        }

        if (!args[0]) {
            senti.send(message.channel_id, "Try using **permissions help**");
            return;
        }

        const user_id = args[0];
        const guild = await senti.getGuild(message.guild_id);

        try {
            // Pobierz informacje o użytkowniku
            const user = await senti.getUser(user_id);

            if (!user) {
                senti.send(message.channel_id, "User not found");
                return;
            }

            console.log("guild:----------------------------------------------------------------------------", guild)
            console.log("user:-----------------------------------------------------------------------------", user)

            // Pobierz obiekt member na podstawie ID użytkownika
            const member = guild.members.cache.get(user.id);

            console.log("member:---------------------------------------------------------------------------", member)

            if (!member) {
                senti.send(message.channel_id, "Member not found");
                return;
            }

            const userRoles = member.roles;

            let permissionsList = [];

            // Przejdź przez role użytkownika i zbierz uprawnienia
            userRoles.cache.forEach((role) => {
                const rolePermissions = guild.roles.cache.get(role.id).permissions.toArray();
                permissionsList.push(rolePermissions);
            });

            // Znajdź i wyświetl najwyższe uprawnienia
            const highestPermissions = permissionsList.reduce((prev, curr) => prev | curr);
            senti.send(message.channel_id, `User's highest permissions: ${highestPermissions.toString(2)}`);
        } catch (error) {
            console.error("An error occurred:", error);
            senti.send(message.channel_id, "An error occurred while checking permissions");
        }
    },
};

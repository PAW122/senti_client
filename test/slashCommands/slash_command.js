module.exports = (commandManager, senti) => {
    //setup command (what user see in discord when using "/" in chat)
    const commandData = {
        name: 'blep',
        description: 'Send a random adorable animal photo',
        type: 1, // This indicates a Chat Input command
        options: [
            {
                name: 'animal',
                description: 'The type of animal',
                type: 3, //String type option
                required: true,
                choices: [
                    {
                        name: 'Dog',
                        value: 'animal_dog'
                    },
                    {
                        name: 'Cat',
                        value: 'animal_cat'
                    },
                    {
                        name: 'Penguin',
                        value: 'animal_penguin'
                    }
                ]
            },
            {
                name: "string_option",
                description: "animal name",
                type: 3,
                require: false
            },
            {
                name: 'only_smol',
                description: 'Whether to show only baby animals',
                type: 5, // This is a Boolean type option
                required: false
            }
        ]
    };

    //execute when user use command
    senti.on("INTERACTION_CREATE", (interaction) => {
        if(interaction.data.name === commandData.name) {
            console.log(`interaction triger name: ${interaction.data.name}`)

            console.log(`string options`)
            console.log(interaction.options)

            console.log("discord options")
            console.log(interaction.data.options)
        }
    })

    //register command globally (sometime can take more time to register)
    commandManager.registerSlashCommand(commandData, senti.user.id)
        .then(response => {
            console.log('Slash command registered:', response.name);
        })
        .catch(error => {
            console.error('Error registering slash command:', error.response.data);
        });

    //register command locally on one specific server. its faster but not recomended for
    //bigest amount of servers
    commandManager.registerGuildSlashCommand(commandData, senti.user.id, "727662119553728532");
}
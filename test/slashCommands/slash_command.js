module.exports = (commandManager, senti) => {
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
                name: 'only_smol',
                description: 'Whether to show only baby animals',
                type: 5, // This is a Boolean type option
                required: false
            }
        ]
    };

    commandManager.registerSlashCommand(commandData, senti.user.id)
        .then(response => {
            console.log('Slash command registered:', response.name);
        })
        .catch(error => {
            console.error('Error registering slash command:', error.response.data);
        });
}
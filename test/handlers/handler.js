const fs = require("fs")
module.exports = (senti) => {


    const commands = senti.commands

    
    
    const komendyFolders = fs.readdirSync(__dirname +`/../commands`)
  
    
    for (const folder of komendyFolders) {
        const commandsFile = fs.readdirSync(__dirname +`/../commands`).filter(file => file.endsWith(".js"));
    
        for(const file of commandsFile) {
            const command = require(__dirname +`/../commands/${file}`);
            commands.set(command.name, command);
        }
    }
}
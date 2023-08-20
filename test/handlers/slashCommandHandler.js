const fs = require("fs")
module.exports = (commandManager, senti) => {
        
    const komendyFolders = fs.readdirSync(__dirname +`/../slashCommands`)
  
    
    for (const folder of komendyFolders) {
        const commandsFile = fs.readdirSync(__dirname +`/../slashCommands`).filter(file => file.endsWith(".js"));
    
        for(const file of commandsFile) {
            const command = require(__dirname +`/../slashCommands/${file}`);
            command(commandManager, senti)
        }
    }
}
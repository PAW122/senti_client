module.exports = (message,client,prefix) => {
    const content = message.content

    if(content.startsWith(prefix) && !message.author.bot) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);//oddziela słowa w komendzie spacją i usówa prefix 
        const commandName = args.shift().toLowerCase();
        if (!client.commands.has(commandName)) return;
        const command = client.commands.get(commandName);

        try{
            command.execute(message, args, client);
        } catch(err) {
            console.log(`an error occurred while executing the command: ${err}`)
        }
    }
}


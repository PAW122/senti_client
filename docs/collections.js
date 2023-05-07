const { SentiClient, Collection } = require("senti_client");

function main() {
    const senti = new SentiClient();

    senti.commands.set("test_command", "command");
    const commands = senti.commands.get("test_command")
    console.log(commands)

    /*
        deafultowo tworzona jest kolekcja commands która jest przypisana
        do clienta
    */


    /*
        można też stworzyć nową kolekcję używając "Collection" \/
    */

    const collection = new Collection;
    console.log(`collection: ${collection}`)
}


/*
    lista opcji które można użyć na Collection:

    set(key, value)
    get(key)
    has(key)
    delete(key)
    clear()
    size()
    keys()
    values() 
    entries()
*/
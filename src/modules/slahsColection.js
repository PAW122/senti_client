/**
 * create new slashCollection to save all slash commands in one place
 * @function add
 * @function delete
 * @function get
 * @function has
 * @function all
 */
class slashCollection {
    constructor() {
        this.commands = {};
    }

    /**
     * add new command
     * @param {string} name - command name 
     * @param {JSON} data - command data
     */
    add(name, data) {
        this.commands[name] = data;
    }

    /**
     * delete command data using command name
     * @param {string} name - command name 
     */
    delete(name) {
        delete this.commands[name];
    }

    /**
     * get command data
     * @param {string} name - command name 
     * @returns 
     */
    get(name) {
        return this.commands[name];
    }

    /**
     * return true if collection has command with same name us name value
     * @param {string} name - command name
     */
    has(name) {
        return this.commands.hasOwnProperty(name);
    }

    /**
     * 
     * @returns all commands
     */
    all() {
        return Object.entries(this.commands).map(([name, data]) => ({ name, data }));
    }
}

module.exports = slashCollection;
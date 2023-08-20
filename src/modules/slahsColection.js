class slashCollection {
    constructor() {
        this.commands = {};
    }

    add(name, data) {
        this.commands[name] = data;
    }

    delete(name) {
        delete this.commands[name];
    }

    get(name) {
        return this.commands[name];
    }

    has(name) {
        return this.commands.hasOwnProperty(name);
    }

    all() {
        return Object.entries(this.commands).map(([name, data]) => ({ name, data }));
    }
}

module.exports = slashCollection;
class Collection {
    constructor() {
        this.map = new Map();
    }

    set(key, value) {
        if(!key || !value) {
            throw new Error("you didn't specify a key or value")
        }
        this.map.set(key, value);
        return this;
    }

    get(key) {
        return this.map.get(key);
    }

    has(key) {
        return this.map.has(key);
    }

    delete(key) {
        return this.map.delete(key);
    }

    clear() {
        this.map.clear();
    }

    size() {
        return this.map.size;
    }

    keys() {
        return this.map.keys();
    }

    values() {
        return this.map.values();
    }

    entries() {
        return this.map.entries();
    }

    forEach(callback, thisArg) {
        this.map.forEach(callback, thisArg);
    }
}

module.exports = Collection;
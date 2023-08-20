
/** Create new Collection
 * @function set
 * @function get
 * @function has
 * @function delete
 * @function clear
 * @function size
 * @function keys
 * @function value
 * @function entries
 * @function forEach
 * 
 * usage: const collection = new Collection()
 */
class Collection {
    constructor() {
        this.map = new Map();
    }

    /**
     * 
     * @param {string} key - object name 
     * @param {object} value - object data
     * @returns 
     */
    set(key, value) {
        if(!key || !value) {
            throw new Error("you didn't specify a key or value")
        }
        this.map.set(key, value);
        return this;
    }

    /**
     * get object data by object name
     * @param {string} key - object name
     * @returns 
     */
    get(key) {
        return this.map.get(key);
    }

    /**
     * return True if collection has object with same name us key value
     * @param {string} key - name
     * @returns {object} - object data
     */
    has(key) {
        return this.map.has(key);
    }

    /**
     * delete dobject by object name
     * @param {string} key - name
     * @returns 
     */
    delete(key) {
        return this.map.delete(key);
    }

    /**
     * delete all objects
     */
    clear() {
        this.map.clear();
    }

    /**
     * return how many objects is in collection
     * @returns size of collection
     */
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
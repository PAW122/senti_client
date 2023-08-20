const axios = require("axios")
/**
 * send all requests from one place
 * @param {string} url 
 * @param {JSON} options 
 * @returns 
 */
async function custom_request(url, options) {
    try {
        return await axios(url, options)
        
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    custom_request
}

/*
TODO:
zintegrować to z api limiterem żeby nie przekraczać limitu requestów,
dodać opcje zrobienia configu np podczas tworzenie w bot.js nowej instancji bota
dodać opcję przekazania objektu z ustawieniami np: ratelimit = xxxx
*/
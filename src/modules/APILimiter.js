const axios = require('axios');

const promises = [];

function RequestManager() {
    const promise = new Promise((resolve, reject) => {
        // Przetwarzanie żądania
        // ...

        // Zwracanie wyniku za pomocą Promise.resolve()
        resolve(result);
    });

    // Dodawanie Promise'a do listy
    promises.push(promise);

    // Zwracanie Promise'a
    return promise;
}


async function sendApi(token, url, data, options) {

    if (!token || !url) {
        throw new Error("send API error\n undefind variable")
    }

    let obj = {
        token: token,
        url: url,
        data: data || null,
        options: options || null
    }

    queue.push(obj)
    RequestManager().then(result => {
        return result
    }).catch(err => {
        return err
    })
}

module.exports = sendApi;


/*
    kolejka wysyłania zapytań do api w celu uniknęcia rate limit

    dodać coś w stypu priorytetów -> w pocjach dodać object -> {
        priority_lvl: low/high
    }
    jeżeli priorytet jest wysoki zadanie jest ustawiane w kolejce na samej górze

    ! sprawdzić czy toggleValueWithDelay() jest w takim samym systemie czasowym co funkcja - api res chyba jest podana w minutach albo sekundach

    sprawdzić w dc docs ile zapytań może być aktywnych w tym samym czasie i zmidyfikować kolejkę jeżeli może być więcej niżjedno

    sprawdzic czy można wysłać zapytanie do api jaki jest rate limit dla danedo tokena, automatycznie ustawić taki limit na kolejce
*/

/*
    dodać jakąś opcję aby user mógł sprawdzić ile zapytań do api wykonał
*/
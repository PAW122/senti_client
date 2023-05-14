const axios = require('axios');

let queue = []
let send = true
var actions = 0

/*
data == np:

{ embeds: [embed] },
*/

/*
potrzebuję funkcji która będzie działała w pentli,
x_ratelimit_limit to maxymalna liczba wiadomości wysyłanych an raz
x_ratelimit_remaining to liczba ile wiadomości można jeszcze wysłać zamin osoiągniemy limit

stwórz funkcję, która wysyła maxymalnie x_ratelimit_limit wiadomości na raz, jeżeli jedna z tych wiadomości zwróci response z api to wtedy wyślij kolejną

jeżeli x_ratelimit_limit < 1 to funkcja czeka na response jednej z wiadomości, jeżeli uzyska rzesponse oznacza to, że jeden z procesów się zakończył i można wysłać kolejną wiadomość
*/

/*
zrobić coś takiego:
jest tyle slotów wysyłania ile wynosi X-RateLimit-Limit np(5)
w penti jest sprawdzane po kolei który slot jest pusty,
jeżeli jakiś slot jest pusty jest dodawane tak poelenie z queue, polecenie jest usówane z queue
jeżeli wszsytkie sloty są zajęte to pentla dalej trwa,

po uzyskaniu response slot czyści zmienną z poleceniem i ustawia się na dostępny
*/

let w_trakcie = 0;
async function send(queue_id) {
    
}



async function sendRequest() {

    while (queue.length > 0) {

        try {
            const obj = queue[0];
            //element jest załadowany do zmiennej -> można usunąć element

            queue.shift(); // usuń wykonane zapytanie z kolejki
            actions++
            let response;

            if (obj.options && obj.options.type == "put") {
                response = await axios.put(obj.url,
                    obj.data || null,
                    {
                        headers: {
                            Authorization: `Bot ${obj.token}`,
                        }
                    }
                );

            } else {
                response = await axios.post(obj.url,
                    obj.data || null,
                    {
                        headers: {
                            Authorization: `Bot ${obj.token}`,
                        }
                    }
                );

            }

            let x_ratelimit_limit = response.headers['x-ratelimit-limit'];
            let x_ratelimit_remaining = response.headers['x-ratelimit-remaining'];
            let x_ratelimit_reset = response.headers['x-ratelimit-reset'];
            let x_ratelimit_reset_after = response.headers['x-ratelimit-reset-after'];
            /*
            X-RateLimit-Limit — liczba żądań, które można wykonać
            X-RateLimit-Remaining — liczba pozostałych żądań, które można wykonać
            X-RateLimit-Reset — Epoka czasu (sekundy od 00:00:00 UTC 1 stycznia 1970 r.), w której resetuje się limit szybkości
            X-RateLimit-Reset-After — całkowity czas (w sekundach) resetowania bieżącego przedziału limitu stawki. Może mieć ułamki dziesiętne zgodne z poprzednią precyzją limitu szybkości w milisekundach
            X-RateLimit-Bucket — unikatowy ciąg oznaczający napotkany limit szybkości (nie obejmuje zasobów najwyższego poziomu w ścieżce)
            X-RateLimit-Global — zwracane tylko w odpowiedziach HTTP 429, jeśli napotkany limit szybkości jest globalnym limitem szybkości (nie na trasie)
            X-RateLimit-Scope — zwracane tylko w przypadku odpowiedzi HTTP 429. Wartością może być użytkownik (na limit bota lub użytkownika), globalny (na globalny limit na bota lub użytkownika) lub współdzielony (na limit zasobów)
            */

            console.log(`rate limit data: ${x_ratelimit_limit} ${x_ratelimit_remaining} ${x_ratelimit_reset} ${x_ratelimit_reset_after}`)
            if (response.data.message == "You are being rate limited.") {
                await toggleValueWithDelay(response.data.retry_after)
            }

            return response;

        } catch (err) {
            if (err == "AxiosError: Request failed with status code 405") {
                queue.shift();
                console.log("AxiosError: Request failed with status code 405 -- Method Not Allowed")
            }
            console.log("APILimiter error: " + err)
            toggleValueWithDelay(300)
            actions++
        }
    };
}

function toggleValueWithDelay(delay) {
    console.log("timeout")
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
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
    const response = await sendRequest()
    return response
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
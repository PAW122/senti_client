const axios = require('axios');

// Zmienna do śledzenia czasu ostatniego żądania
let lastRequestTime = 0;

async function RequestManager(obj) {
    try {
        // Sprawdź, czy upłynął odpowiedni czas od ostatniego żądania
        const currentTime = Date.now();
        const timeElapsed = currentTime - lastRequestTime;
        const timeToWait = 1000 / 3; // 1000 ms / 3 żądania = 333 ms na żądanie
        if (timeElapsed < timeToWait) {
            // Jeśli upłynął mniej niż wymagany czas, odczekaj resztę
            const timeRemaining = timeToWait - timeElapsed;
            await new Promise(resolve => setTimeout(resolve, timeRemaining));
        }

        if (obj.options && obj.options.type == "delete") {
            response = await axios.delete(obj.url,
                {
                    headers: {
                        Authorization: `Bot ${obj.token}`,
                    }
                }
            );

        } else if (obj.options && obj.options.type == "put") {
            response = await axios.put(obj.url,
                obj.data || null,
                {
                    headers: {
                        Authorization: `Bot ${obj.token}`,
                    }
                }
            );
        } else {
            console.log("else")
            console.log(obj)
            response = await axios.post(obj.url,
                obj.data || null,
                {
                    headers: {
                        Authorization: `Bot ${obj.token}`,
                    }
                }
            );
        }

        // Zaktualizuj czas ostatniego żądania
        lastRequestTime = Date.now();
        return response;

    } catch (err) {
    if (err.response && err.response.status === 405) {
        queue.shift();
        console.log("Request failed with status code 405 -- Method Not Allowed")
    } else if (err.response && err.response.status === 429) {
        console.log("Request failed with status code 429 -- Rate Limit\n to many requests")
    }

    // Dodawanie informacji o miejscu, w którym błąd wystąpił
    console.log("APILimiter error: " + err);
    console.error("Error stack:", err.stack); // To wyświetli pełny stos błędów
}
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

    try {
        const res = await RequestManager(obj)
        return res
    } catch (err) {
        return err
    }
}

module.exports = sendApi;

/*
na podstawie tego kodu zrobić syf który będzie po kolei wysyłał rządania z kolejki

this.heartbeatInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ op: 1, d: null }));
                    }
                }, 30000);


*/
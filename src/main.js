const EventEmitter = require("events");
const axios = require("axios");
const { DISCORD_API_URL, ws_gateway } = require("./config/config.json");
const send_api = require("./handlers/send/send");
const WebSocket = require('ws');
const Collection = require("./collections");
const sendWithEmbed_api = require("./handlers/send_embed")
const addReaction_api = require("./modules/reactions")


let instance = null;
class SentiClient extends EventEmitter {
    constructor() {
        super();
        this.connected = false;
        this.token = null;
        this.commands = new Collection();
    }

    static getInstance() {
        if (!instance) {
          instance = new SentiClient();
        }
        return instance;
      }

    async connect(token) {
        if (!this.connected) {
            this.token = token;
            const response = await axios.get(`${DISCORD_API_URL}/users/@me`, {
                headers: {
                    Authorization: `Bot ${this.token}`,
                },
            });
            this.user = response.data;

            // Pobierz adres URL bramy Discord i utwórz WebSocket
            const gateway = await this.getGateway();
            const ws = new WebSocket(`${gateway.url}${ws_gateway}`, { pingInterval: 30000, pingTimeout: 60000 });

            // Zarejestruj funkcję wywoływaną, gdy otrzymasz nową wiadomość
            ws.on("message", (data) => {
                const payload = JSON.parse(data);

                if (payload.op === 0) {
                    if (payload.t === "MESSAGE_CREATE") {
                        const message = payload.d
                        const obj = JSON.stringify(payload.d)

                        this.emit("messageCreate", message, obj);
                    }
                }
            });

            ws.on("open", () => {
                console.log("Connected to Discord gateway");

                // Wyślij żądanie IDENTIFY, aby zidentyfikować bota
                ws.send(
                    JSON.stringify({
                        op: 2,
                        d: {
                            token: this.token,
                            intents: 513,
                            properties: {
                                $os: "linux",
                                $browser: "senti_client",
                                $device: "senti_client",
                            },
                        },
                    })
                );

                // Uruchom funkcję heartbeat po nawiązaniu połączenia z serwerem
                this.heartbeatInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ op: 1, d: null }));
                    }
                }, 30000);
            });

            this.connected = true;
            this.emit("ready", this);
        }

    }

    async send(channel, message, reaction) {
        send_api(this.token, channel, message, reaction);
    }

    async sendEmbed(channel_id, embed, reaction) {
        sendWithEmbed_api(this.token, channel_id, embed,reaction)
    }

    async addRaction(channel_id,message_id,reaction) {
        addReaction_api(this.token, channel_id, message_id, reaction)
    }

    async getGateway() {
        const response = await axios.get(`${DISCORD_API_URL}/gateway/bot`, {
            headers: {
                Authorization: `Bot ${this.token}`,
            },
        });
        return response.data;
    }
}

let heartbeatInterval;
function heartbeat(ws, heartbeatIntervalMs) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(() => {
        ws.send(JSON.stringify({
            op: 1,
            d: null,
        }));
    }, heartbeatIntervalMs);
}


module.exports = SentiClient;

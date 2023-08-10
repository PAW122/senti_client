const EventEmitter = require("events");
const axios = require("axios");
const { DISCORD_API_URL, ws_gateway } = require("./config/config.json");
const send_api = require("./handlers/send/send");
const WebSocket = require('ws');
const Collection = require("./collections");
const sendWithEmbed_api = require("./handlers/send_embed")
const addReaction_api = require("./modules/reactions")
const req_api = require("./modules/APILimiter")

let instance = null;
class SentiClient extends EventEmitter {
    constructor(eventHandlers) {
        super();
        this.connected = false;
        this.token = null;
        this.commands = new Collection();

        //emit events
        this.eventHandlers = eventHandlers;
        this.customEventHandlers = {};
    }

    static getInstance() {
        if (!instance) {
            instance = new SentiClient();
        }
        return instance;
    }

    /**
     * connect with bot.
     * @param {string} token - The bot login key.
     * @returns {event} - return information in "ready" event.
     * @throws {Error} - Return error if needed
    */
    async connect(token) {
        if (!token) throw new Error("connect error:\n token is undefind")
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

            //recive events
            const eventHandlers = {
                'AUTO_MODERATION_RULE_CREATE': (data) => this.emit("AUTO_MODERATION_RULE_CREATE", data),
                'AUTO_MODERATION_RULE_UPDATE': (data) => this.emit("AUTO_MODERATION_RULE_UPDATE", data),
                'AUTO_MODERATION_RULE_DELETE': (data) => this.emit("AUTO_MODERATION_RULE_DELETE", data),
                'AUTO_MODERATION_ACTION_EXECUTION': (data) => this.emit("AUTO_MODERATION_ACTION_EXECUTION", data),
                'CHANNEL_CREATE': (data) => this.emit('CHANNEL_CREATE', data),
                'CHANNEL_UPDATE': (data) => this.emit("CHANNEL_UPDATE", data),
                'CHANNEL_DELETE': (data) => this.emit("CHANNEL_DELETE", data),
                'CHANNEL_PINS_UPDATE': (data) => this.emit("CHANNEL_PINS_UPDATE", data),
                'THREAD_CREATE': (data) => this.emit("THREAD_CREATE", data),
                'THREAD_UPDATE': (data) => this.emit("THREAD_UPDATE", data),
                'THREAD_DELETE': (data) => this.emit("THREAD_DELETE", data),
                'THREAD_LIST_SYNC': (data) => this.emit("THREAD_LIST_SYNC", data),
                'THREAD_MEMBER_UPDATE': (data) => this.emit("THREAD_MEMBER_UPDATE", data),
                'THREAD_MEMBES_UPDATE': (data) => this.emit("THREAD_MEMBES_UPDATE", data),
                'GUILD_CREATE': (data) => this.emit("GUILD_CREATE", data),
                'GUILD_UPDATE': (data) => this.emit("GUILD_UPDATE", data),
                'GUILD_DELETE': (data) => this.emit("GUILD_DELETE", data),
                'GUILD_AUDIT_LOG_ENTRY_CREATE': (data) => this.emit("GUILD_AUDIT_LOG_ENTRY_CREATE", data),
                'GUILD_BAN_ADD': (data) => this.emit('GUILD_BAN_ADD', data),
                'GUILD_BAN_REMOVE': (data) => this.emit("GUILD_BAN_REMOVE", data),
                'GUILD_EMOJIS_UPDATE': (data) => this.emit("GUILD_EMOJIS_UPDATE", data),
                'GUILD_STICKERS_UPDATE': (data) => this.emit("GUILD_STICKERS_UPDATE", data),
                'GUILD_INTEGRATIONS_UPDATE': (data) => this.emit("GUILD_INTEGRATIONS_UPDATE", data),
                'GUILD_MEMBER_ADD': (data) => this.emit("GUILD_MEMBER_ADD", data),
                'GUILD_MEMBER_REMOVE': (data) => this.emit("GUILD_MEMBER_REMOVE", data),
                'GUILD_MEMBER_UPDATE': (data) => this.emit("GUILD_MEMBER_UPDATE", data),
                'GUILD_MEMBERS_CHUNK': (data) => this.emit("GUILD_MEMBERS_CHUNK", data),
                'GUILD_ROLE_CREATE': (data) => this.emit("GUILD_ROLE_CREATE", data),
                'GUILD_ROLE_UPDATE': (data) => this.emit("GUILD_ROLE_UPDATE", data),
                'GUILD_ROLE_DELETE': (data) => this.emit("GUILD_ROLE_DELETE", data),
                'GUILD_SCHEDULE_EVENT_CREATE': (data) => this.emit("GUILD_SCHEDULE_EVENT_CREATE", data),
                'GUILD_SCHEDULE_EVENT_UPDATE': (data) => this.emit("GUILD_SCHEDULE_EVENT_UPDATE", data),
                'GUILD_SCHEDULE_EVENT_DELETE': (data) => this.emit("GUILD_SCHEDULE_EVENT_DELETE", data),
                'GUILD_SCHEDULE_EVENT_USER_ADD': (data) => this.emit("GUILD_SCHEDULE_EVENT_USER_ADD", data),
                'GUILD_SCHEDULE_EVENT_USER_REMOVE': (data) => this.emit("GUILD_SCHEDULE_EVENT_USER_REMOVE", data),
                'INTEGRATION_CREATE': (data) => this.emit("INTEGRATION_CREATE", data),
                'INTEGRATION_UPDATE': (data) => this.emit("INTEGRATION_UPDATE", data),
                'INTEGRATION_DELETE': (data) => this.emit("INTEGRATION_DELETE", data),
                'INTERACTION_CREATE': (data) => this.emit("INTERACTION_CREATE", data),
                'INVITE_CREATE': (data) => this.emit("INVITE_CREATE", data),
                'INVITE_DELETE': (data) => this.emit("INVITE_DELETE", data),
                'MESSAGE_CREATE': (data) => {
                    const message = data;
                    const obj = JSON.stringify(data);
                    if (!message) return
                    this.emit('messageCreate', message, obj);
                },
                'MESSAGE_UPDATE': (data) => this.emit("MESSAGE_UPDATE", data),
                'MESSAGE_DELETE': (data) => this.emit("MESSAGE_DELETE", data),
                'MESSAGE_DELETE_BULK': (data) => this.emit("MESSAGE_DELETE_BULK", data),  //Multiple messages were deleted at once
                'MESSAGE_REACTION_ADD': (data) => this.emit("MESSAGE_REACTION_ADD", data),
                'MESSAGE_REACTION_REMOVE': (data) => this.emit("MESSAGE_REACTION_REMOVE", data),
                'MESSAGE_REACTION_REMOVE_ALL': (data) => this.emit("MESSAGE_REACTION_REMOVE_ALL", data),
                'MESSAGE_REACTION_REMOVE_EMOJI': (data) => this.emit("MESSAGE_REACTION_REMOVE_EMOJI", data),
                'PRESENCE_UPDATE': (data) => this.emit("PRESENCE_UPDATE", data),   //User was updated
                'STAGE_INSTANCE_CREATE': (data) => this.emit("STAGE_INSTANCE_CREATE", data),
                'STAGE_INSTANCE_UPDATE': (data) => this.emit("STAGE_INSTANCE_UPDATE", data),
                'STAGE_INSTANCE_DELETE': (data) => this.emit("STAGE_INSTANCE_DELETE", data),
                'TYPING_START': (data) => this.emit("TYPING_START", data),
                'USER_UPDATE': (data) => this.emit("USER_UPDATE", data),
                'VOICE_STATE_UPDATE': (data) => this.emit("VOICE_STATE_UPDATE", data),
                'VOICE_SERVER_UPDATE': (data) => this.emit("VOICE_SERVER_UPDATE", data),
                'WEBHOOKS_UPDATE': (data) => this.emit("WEBHOOKS_UPDATE", data)
            };

            // Zarejestruj funkcję wywoływaną, gdy otrzymasz nową wiadomość
            ws.on('message', (data) => {
                const payload = JSON.parse(data);
                if (payload.op === 0) {
                    const eventType = payload.t;
                    if (eventHandlers[eventType]) {
                        eventHandlers[eventType](payload.d);
                    }
                }
            });

            ws.on("open", () => {
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

    /**
     * Send a message.
     * @param {string} channel - The ID of the channel the message is send.
     * @param {string} message - The content of message u want to send.
     * @param {string} reaction - Optional - The emoji teaction added to message.
     * @returns {Promise<Object>} - Objects representing responses from the Discord API.
     * @throws {Error} - Return error if needed
    */
    async send(channel, message, reaction) {
        return send_api(this.token, channel, message, reaction);
    }

    /**
     * Send embed message.
     * @param {string} channel_id - The ID of the channel the message is send.
     * @param {object} embed - The embed object.
     * @param {string} reaction - Optional - The emoji you want to add to the message
     * @returns {Promise<Object>} - Objects representing responses from the Discord API.
     * @throws {Error} If reaction is missing.
    */
    async sendEmbed(channel_id, embed, reaction) {
        if (!channel_id) throw new Error("> sendEmbed error\n: channel id is undefind")
        if (!embed) throw new Error("> sendEmbed error\n: embed is undefind")

        return sendWithEmbed_api(this.token, channel_id, embed, reaction)
    }


    /**
     * Adds emoji reaction to message.
     * @param {string} channel_id - The ID of the channel the message is on.
     * @param {string} message_id - The ID of the message to which the added reaction belongs.
     * @param {string} reaction - The emoji you want to add to the message
     * @returns {Promise<Object>} -  An object representing the response from the Discord API.
     * @throws {Error} - return error if somethink is missing.
    */
    async addReaction(channel_id, message_id, reaction) {
        if (!channel_id) throw new Error("> addReaction error\n: channel id is undefind")
        if (!message_id) throw new Error("> addReaction error\n: message id is undefind")
        if (!reaction) throw new Error("> addReaction error:\n reaction is undefind")
        return addReaction_api(this.token, channel_id, message_id, reaction)
    }

    /**
     * Deletes a message on a given channele.
     * @param {string} channel_id - The ID of the channel the message is on.
     * @param {string} message_id - The ID of the message to be deleted.
     * @returns {Promise<Object>} An object representing the response from the Discord API.
     * @throws {Error} If channel_id or message_id is missing.
    */
    async MESSAGE_DELETE(channel_id, message_id) {
        if (!channel_id) throw new Error("> MESSAGE_DELETE error\n: channel id is undefind")
        if (!message_id) throw new Error("> MESSAGE_DELETE error\n: message id is undefind")

        let options = {
            type: "delete"
        }
        let url = `${DISCORD_API_URL}/channels/${channel_id}/messages/${message_id}`
        const res = req_api(this.token, url, options)
        return res
    }

    /**
     * Aktualizuje istniejącą wiadomość na danym kanale.
     * @param {string} channel_id - ID kanału, na którym znajduje się wiadomość.
     * @param {string} message_id - ID wiadomości do zaktualizowania.
     * @param {string} new_content - Nowa treść wiadomości.
     * @returns {Promise<Object>} Obiekt reprezentujący odpowiedź z API Discorda.
     * @throws {Error} Jeśli brakuje channel_id, message_id lub new_content.
     */
    async MESSAGE_UPDATE(channel_id, message_id, new_content) {
        if (!channel_id) throw new Error("> MESSAGE_UPDATE error\n: channel id is undefind");
        if (!message_id) throw new Error("> MESSAGE_UPDATE error\n: message id is undefind");
        if (!new_content) throw new Error("> MESSAGE_UPDATE error\n: new content is undefind");
        // TODO: przenieść do APILimiter
        let options = {
            method: "patch",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: {
                content: new_content
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/messages/${message_id}`;

        try {
            const response = await axios(url, options);
            return response.data;
        } catch (error) {
            if (error.code == 50005) {
                console.log("Cannot edit a message authored by another user")
            }
            console.error("An error occurred while updating the message:", error.message);
            return error;
        }
    }

    /**
    * Usuwa wiele wiadomości na danym kanale.
    * @param {string} channel_id - ID kanału, na którym znajdują się wiadomości.
    * @param {Array<string>} message_ids - Tablica ID wiadomości do usunięcia.
    * @returns {Promise<Object>} Obiekt reprezentujący odpowiedź z API Discorda.
    * @throws {Error} Jeśli brakuje channel_id lub message_ids.
    */
    async MESSAGE_DELETE_BULK(channel_id, message_ids) {
        if (!channel_id) throw new Error("> MESSAGE_DELETE_BULK error\n: channel id is undefind");
        if (!message_ids || message_ids.length === 0) throw new Error("> MESSAGE_DELETE_BULK error\n: message ids are missing");
        // TODO: przenieść do APILimiter
        let options = {
            method: "post",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: {
                messages: message_ids
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/messages/bulk-delete`;

        try {
            const response = await axios(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while deleting messages:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje dodawanie reakcji do wiadomości.
 * @param {string} channel_id - ID kanału, w którym znajduje się wiadomość.
 * @param {string} message_id - ID wiadomości, do której dodawana jest reakcja.
 * @param {string} emoji - Emoji, którą chcesz dodać jako reakcję (np. "👍").
 * @returns {Promise<Object>} Obiekt reprezentujący odpowiedź z API Discorda.
 * @throws {Error} Jeśli brakuje channel_id, message_id lub emoji.
 */
    async MESSAGE_REACTION_ADD(channel_id, message_id, emoji) {
        if (!channel_id) throw new Error("> MESSAGE_REACTION_ADD error\n: channel id is undefind");
        if (!message_id) throw new Error("> MESSAGE_REACTION_ADD error\n: message id is undefind");
        if (!emoji) throw new Error("> MESSAGE_REACTION_ADD error\n: emoji is undefind");
        // TODO: przenieść do APILimiter
        let options = {
            method: "put",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/messages/${message_id}/reactions/${encodeURIComponent(emoji)}/@me`;

        try {
            const response = await axios(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while adding reaction:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje usuwanie reakcji z wiadomości.
 * @param {string} channel_id - ID kanału, w którym znajduje się wiadomość.
 * @param {string} message_id - ID wiadomości, z której usuwana jest reakcja.
 * @param {string} emoji - Emoji, którą chcesz usunąć jako reakcję (np. "👍").
 * @returns {Promise<Object>} Obiekt reprezentujący odpowiedź z API Discorda.
 * @throws {Error} Jeśli brakuje channel_id, message_id lub emoji.
 */
    async MESSAGE_REACTION_REMOVE(channel_id, message_id, emoji) {
        if (!channel_id) throw new Error("> MESSAGE_REACTION_REMOVE error\n: channel id is undefind");
        if (!message_id) throw new Error("> MESSAGE_REACTION_REMOVE error\n: message id is undefind");
        if (!emoji) throw new Error("> MESSAGE_REACTION_REMOVE error\n: emoji is undefind");

        let options = {
            method: "delete",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/messages/${message_id}/reactions/${encodeURIComponent(emoji)}/@me`;

        try {
            const response = await axios(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while removing reaction:", error.message);
            throw error;
        }
    }

    /**
 * Usuwa wszystkie reakcje z danej wiadomości.
 * @param {string} channel_id - ID kanału, w którym znajduje się wiadomość.
 * @param {string} message_id - ID wiadomości, z której usuwane są reakcje.
 * @returns {Promise<Object>} Obiekt reprezentujący odpowiedź z API Discorda.
 * @throws {Error} Jeśli brakuje channel_id lub message_id.
 */
    async MESSAGE_REACTION_REMOVE_ALL(channel_id, message_id) {
        if (!channel_id) throw new Error("> MESSAGE_REACTION_REMOVE_ALL error\n: channel id is undefind");
        if (!message_id) throw new Error("> MESSAGE_REACTION_REMOVE_ALL error\n: message id is undefind");

        let options = {
            method: "delete",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/messages/${message_id}/reactions`;

        try {
            const response = await axios(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while removing all reactions:", error.message);
            throw error;
        }
    }

    /**
 * Usuwa wszystkie reakcje z danej wiadomości, dla konkretnej emoji.
 * @param {string} channel_id - ID kanału, w którym znajduje się wiadomość.
 * @param {string} message_id - ID wiadomości, z której usuwane są reakcje.
 * @param {string} emoji - Emoji, dla której chcesz usunąć reakcje (np. "👍").
 * @returns {Promise<Object>} Obiekt reprezentujący odpowiedź z API Discorda.
 * @throws {Error} Jeśli brakuje channel_id, message_id lub emoji.
 */
    async MESSAGE_REACTION_REMOVE_EMOJI(channel_id, message_id, emoji) {
        if (!channel_id) throw new Error("> MESSAGE_REACTION_REMOVE_EMOJI error\n: channel id is undefind");
        if (!message_id) throw new Error("> MESSAGE_REACTION_REMOVE_EMOJI error\n: message id is undefind");
        if (!emoji) throw new Error("> MESSAGE_REACTION_REMOVE_EMOJI error\n: emoji is undefind");

        let options = {
            method: "delete",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/messages/${message_id}/reactions/${encodeURIComponent(emoji)}`;

        try {
            const response = await axios(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while removing reactions for emoji:", error.message);
            throw error;
        }
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


module.exports = SentiClient;

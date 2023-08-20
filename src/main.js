const EventEmitter = require("events");
const axios = require("axios");
const { DISCORD_API_URL, ws_gateway } = require("./config/config.json");
const send_api = require("./handlers/send/send");
const WebSocket = require('ws');
const Collection = require("./collections");
const sendWithEmbed_api = require("./handlers/send_embed")
const addReaction_api = require("./modules/reactions")
const req_api = require("./modules/APILimiter")
const { custom_request } = require("./modules/ReqApi")

let instance = null;
class SentiClient extends EventEmitter {
    constructor(eventHandlers) {
        super();
        this.connected = false;
        this.token = null;
        this.commands = new Collection();
        this.slashCommands = new Collection();
        this.intents = 513//deafult

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
    async connect(token, options) {
        if (!token) throw new Error("connect error:\n token is undefind")
        if(options && options.intents) {
            this.intents = options.intents
        }
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
                'INTERACTION_CREATE': (data) => {
                    this.emit("INTERACTION_CREATE", data)
                },
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
                            intents: this.intents,
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
            const response = await custom_request(url, options);
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
        console.log(message_ids)
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
            const response = await custom_request(url, options);
            console.log(response)
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
            const response = await custom_request(url, options);
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
            const response = await custom_request(url, options);
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
            const response = await custom_request(url, options);
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
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while removing reactions for emoji:", error.message);
            throw error;
        }
    }

    /**
 * Wysyła sygnał, że użytkownik zaczyna pisać na danym kanale przez kilka sekund.
 * @param {string} channel_id - ID kanału, na którym użytkownik zaczyna pisać.
 * @returns {Promise<Object>} Obiekt reprezentujący odpowiedź z API Discorda.
 * @throws {Error} Jeśli brakuje channel_id.
 */
    async TYPING_START(channel_id) {
        if (!channel_id) throw new Error("> TYPING_START error\n: channel id is undefind");

        let options = {
            method: "post",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/typing`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while sending typing indicator:", error.message);
            throw error;
        }
    }

    /**
     * Obsługuje dodanie bana na użytkownika na serwerze.
     * @param {string} guild_id - ID serwera, na którym nastąpiło dodanie bana.
     * @param {Object} user - Pełny obiekt reprezentujący użytkownika, który zostanie zbanowany.
     * @param {string} ban_reason - Powód zbanowania urzytkownika
     * @returns {Promise<void>} Promise bez zwracanych danych.
     * @throws {Error} Jeśli brakuje guild_id, user lub ban_reason.
     */
    async GUILD_BAN_ADD(guild_id, user, ban_reason) {
        if (!guild_id) throw new Error("> GUILD_BAN_ADD error\n: guild id is undefind");
        if (!user) throw new Error("> GUILD_BAN_ADD error\n: user is undefind");
        if (!ban_reason) throw new Error("> GUILD_BAN_ADD error\n: ban reason is undefind");

        let options = {
            method: "put",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: {
                reason: ban_reason || "No reason"
            }
        };
        let url = `${DISCORD_API_URL}/guilds/${guild_id}/bans/${user.id}`;

        try {
            const response = await custom_request(url, options);
            return response
        } catch (error) {
            console.error("An error occurred while adding ban:", error.message);
            throw error;
        }
    }

    /**
     * Pobiera pełne informacje o użytkowniku.
     * @param {string} user_id - ID użytkownika, którego dane chcesz pobrać.
     * @returns {Promise<Object>} Obiekt reprezentujący pełne informacje o użytkowniku.
     * @throws {Error} Jeśli brakuje user_id.
     */
    async getFullUserInfo(user_id) {
        if (!user_id) throw new Error("User ID is undefined");

        let options = {
            method: "get",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
        }

        let url = `${DISCORD_API_URL}/users/${user_id}`;


        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while getting user info:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje usunięcie bana na użytkowniku na serwerze.
 * @param {string} guild_id - ID serwera, na którym nastąpiło usunięcie bana.
 * @param {Object} user - Pełny obiekt reprezentujący użytkownika, który zostanie zbanowany.
 * @returns {Promise<void>} Promise bez zwracanych danych.
 * @throws {Error} Jeśli brakuje guild_id lub user_id.
 */
    async GUILD_BAN_REMOVE(guild_id, user) {
        if (!guild_id) throw new Error("> GUILD_BAN_REMOVE error\n: guild id is undefind");
        if (!user) throw new Error("> GUILD_BAN_REMOVE error\n: user id is undefind");

        let options = {
            method: "delete",
            headers: {
                Authorization: `Bot ${this.token}`
            }
        };
        let url = `${DISCORD_API_URL}/guilds/${guild_id}/bans/${user.id}`;

        try {
            const response = await custom_request(url, options);
            return response.data
        } catch (error) {
            console.error("An error occurred while removing ban:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje tworzenie nowej roli na serwerze.
 * @param {string} guild_id - ID serwera, na którym ma być stworzona nowa rola.
 * @param {Object} role_data - Dane nowej roli, takie jak nazwa, kolor itp.
 * @returns {Promise<Object>} Obiekt reprezentujący nowo utworzoną rolę.
 * @throws {Error} Jeśli brakuje guild_id lub role_data.
 */
    async GUILD_ROLE_CREATE(guild_id, role_data) {
        if (!guild_id) throw new Error("> GUILD_ROLE_CREATE error\n: guild id is undefind");
        if (!role_data) throw new Error("> GUILD_ROLE_CREATE error\n: role data is undefind");

        let options = {
            method: "post",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: role_data
        };
        let url = `${DISCORD_API_URL}/guilds/${guild_id}/roles`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while creating role:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje aktualizację istniejącej roli na serwerze.
 * @param {string} guild_id - ID serwera, na którym ma być zaktualizowana rola.
 * @param {string} role_id - ID roli, która ma być zaktualizowana.
 * @param {Object} updated_data - Zaktualizowane dane roli, np. nazwa, kolor itp.
 * @returns {Promise<Object>} Obiekt reprezentujący zaktualizowaną rolę.
 * @throws {Error} Jeśli brakuje guild_id, role_id lub updated_data.
 */
    async GUILD_ROLE_UPDATE(guild_id, role_id, updated_data) {
        if (!guild_id) throw new Error("> GUILD_ROLE_UPDATE error\n: guild id is undefind");
        if (!role_id) throw new Error("> GUILD_ROLE_UPDATE error\n: role id is undefind");
        if (!updated_data) throw new Error("> GUILD_ROLE_UPDATE error\n: updated data is undefind");

        let options = {
            method: "patch",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: updated_data
        };
        let url = `${DISCORD_API_URL}/guilds/${guild_id}/roles/${role_id}`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while updating role:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje usunięcie istniejącej roli na serwerze.
 * @param {string} guild_id - ID serwera, na którym ma być usunięta rola.
 * @param {string} role_id - ID roli, która ma być usunięta.
 * @returns {Promise<void>} Promise bez zwracanych danych.
 * @throws {Error} Jeśli brakuje guild_id lub role_id.
 */
    async GUILD_ROLE_DELETE(guild_id, role_id) {
        if (!guild_id) throw new Error("> GUILD_ROLE_DELETE error\n: guild id is undefind");
        if (!role_id) throw new Error("> GUILD_ROLE_DELETE error\n: role id is undefind");

        let options = {
            method: "delete",
            headers: {
                Authorization: `Bot ${this.token}`
            }
        };
        let url = `${DISCORD_API_URL}/guilds/${guild_id}/roles/${role_id}`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while deleting role:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje usunięcie istniejącego zaproszenia na serwerze.
 * @param {string} invite_code - Kod zaproszenia, które ma zostać usunięte.
 * @returns {Promise<void>} Promise bez zwracanych danych.
 * @throws {Error} Jeśli brakuje invite_code.
 */
    async INVITE_DELETE(invite_code) {
        if (!invite_code) throw new Error("> INVITE_DELETE error\n: invite code is undefind");

        let options = {
            method: "delete",
            headers: {
                Authorization: `Bot ${this.token}`
            }
        };
        let url = `${DISCORD_API_URL}/invites/${invite_code}`;

        try {
            const response = await custom_request(url, options);
            return response
        } catch (error) {
            console.error("An error occurred while deleting invite:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje tworzenie nowego zaproszenia na serwerze.
 * @param {string} channel_id - ID kanału, na którym ma być utworzone zaproszenie.
 * @param {number} max_uses - Maksymalna ilość użyć zaproszenia (opcjonalne).
 * @param {number} max_age - Maksymalny czas ważności zaproszenia w sekundach (opcjonalne).
 * @returns {Promise<Object>} Obiekt reprezentujący nowe zaproszenie.
 * @throws {Error} Jeśli brakuje channel_id.
 */
    async INVITE_CREATE(channel_id, max_uses = 0, max_age = 0) {
        if (!channel_id) throw new Error("> INVITE_CREATE error\n: channel id is undefind");

        let options = {
            method: "post",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: {
                max_uses: max_uses,
                max_age: max_age
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}/invites`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while creating invite:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje tworzenie nowego kanału na serwerze.
 * @param {string} guild_id - ID serwera, na którym ma być utworzony kanał.
 * @param {Object} channel_data - Dane nowego kanału, takie jak nazwa, typ itp.
 * @returns {Promise<Object>} Obiekt reprezentujący nowo utworzony kanał.
 * @throws {Error} Jeśli brakuje guild_id lub channel_data.
 */
    async CHANNEL_CREATE(guild_id, channel_data) {
        if (!guild_id) throw new Error("> CHANNEL_CREATE error\n: guild id is undefind");
        if (!channel_data) throw new Error("> CHANNEL_CREATE error\n: channel data is undefind");

        let options = {
            method: "post",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: channel_data
        };
        let url = `${DISCORD_API_URL}/guilds/${guild_id}/channels`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while creating channel:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje aktualizację istniejącego kanału na serwerze.
 * @param {string} channel_id - ID kanału, który ma być zaktualizowany.
 * @param {Object} updated_data - Zaktualizowane dane kanału, np. nazwa, pozycja itp.
 * @returns {Promise<Object>} Obiekt reprezentujący zaktualizowany kanał.
 * @throws {Error} Jeśli brakuje channel_id lub updated_data.
 */
    async CHANNEL_UPDATE(channel_id, updated_data) {
        if (!channel_id) throw new Error("> CHANNEL_UPDATE error\n: channel id is undefind");
        if (!updated_data) throw new Error("> CHANNEL_UPDATE error\n: updated data is undefind");

        let options = {
            method: "patch",
            headers: {
                Authorization: `Bot ${this.token}`,
                "Content-Type": "application/json"
            },
            data: updated_data
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while updating channel:", error.message);
            throw error;
        }
    }

    /**
 * Obsługuje usunięcie istniejącego kanału na serwerze.
 * @param {string} channel_id - ID kanału, który ma być usunięty.
 * @returns {Promise<void>} Promise bez zwracanych danych.
 * @throws {Error} Jeśli brakuje channel_id.
 */
    async CHANNEL_DELETE(channel_id) {
        if (!channel_id) throw new Error("> CHANNEL_DELETE error\n: channel id is undefind");

        let options = {
            method: "delete",
            headers: {
                Authorization: `Bot ${this.token}`
            }
        };
        let url = `${DISCORD_API_URL}/channels/${channel_id}`;

        try {
            const response = await custom_request(url, options);
            return response.data;
        } catch (error) {
            console.error("An error occurred while deleting channel:", error.message);
            throw error;
        }
    }

    /**
     * Funkcja do wysyłania odpowiedzi na interakcję
     * @param {object} interaction  - the interaction you want to respond to
     * @param {message} user_content - message / embed
     * @returns {Promise<void>} - Discord api response
     */
    async interaction_reply(interaction, user_content) {

        let response = user_content

        if (!user_content.type) {

            response = {
                type: 4, // Typ 4 oznacza odpowiedź na komendę slash
                data: {
                    content: `${user_content}`
                }
            };
        } else {
            //Embed response
            response = {
                type: 4,
                data: {
                    embeds: [user_content]
                }
            }
        }

        const headers = {
            Authorization: `Bot ${this.token}`,
            "Content-Type": "application/json"
        };

        // Wysłanie odpowiedzi do Discord API
        try {
            const responseEndpoint = `${DISCORD_API_URL}/interactions/${interaction.id}/${interaction.token}/callback`;
            return await axios.post(responseEndpoint, response, { headers });
        } catch (error) {
            console.error('Error sending response:', error.message);
            if (error.response) {
                console.error('Response data:', error.response.data);
                return error.response.data
            }
        }
    }

    /**
     * Delete 1 - 100 last messages on channel
     * @param {number} channelId - channel id 
     * @param {number} count - number > 1 and < 100
     */
    async get_messages(channelId, count) {
        count = parseInt(count)

        if (!count) {
            throw new Error("'count' should be a number equal or lower then 100 and higher then 1")
        }

        if(count > 100) throw new Error("count is to hight")
        else if(count < 1) throw new Error("count is to low")

        if (!channelId) throw new Error("channelId is undefind")


        try {
            const endpoint = `${DISCORD_API_URL}/channels/${channelId}/messages`;

            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bot ${this.token}`,
                },
                params: {
                    limit: count,
                },
            });

            var messageIds = response.data.map(message => message.id);

            if(messageIds < 2) {
                console.error(messageIds)
            } else {
                return messageIds
            }

        } catch (error) {
            console.error('Błąd', error.message);
        }
    }

    /**
     * allows you to remove the registered command slash
     * @param {id} commandId
     * 
     * after registering a slash command, it is assigned to the bot and is displayed 
     * in the menu after typing / on discord. If the bot stops supporting the command, 
     * e.g. "ping", it will be displayed for some time. deleteSlashCommand can be used to prevent this
     * 
     * !! warning !!
     *  both commands are not tested
     */
    async deleteSlashCommand(senti, commandId) {
        const CLIENT_ID = senti.user.id
        const url = `${DISCORD_API_URL}/applications/${CLIENT_ID}/commands/${commandId}`;
    
        try {
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bot ${BOT_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("Slash command deleted:", response.data);
        } catch (error) {
            console.error('An error occurred while deleting slash command:', error.message);
            throw error;
        }
    }

    /**
     * works the same as deleteSlash Command, but removes all registered slash commands assigned to the bot
     */
    async deleteAllSlashCommands(senti) {
        const CLIENT_ID = senti.user.id
        const url = `${DISCORD_API_URL}/applications/${CLIENT_ID}/commands`;
    
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bot ${this.token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const commands = response.data;
            for (const command of commands) {
                await axios.delete(`${url}/${command.id}`, {
                    headers: {
                        Authorization: `Bot ${this.token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`Deleted command with ID ${command.id}`);
            }
        } catch (error) {
            console.error('An error occurred while deleting all slash commands:', error.message);
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

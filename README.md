# Senti Client

![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.0.9-brightgreen.svg)
![npm Downloads](https://img.shields.io/npm/dt/senti-client.svg)
[![Discord](https://img.shields.io/discord/1234567890?label=Discord&logo=discord&color=7289DA)](https://discord.gg/your-discord-server)

Senti Client is a JavaScript library that provides a simple and intuitive way to interact with the Discord API.

## Features

- Easy-to-use interface for interacting with the Senti API.
- Simplified methods for sending and receiving data.
- Enhanced error handling and response parsing.

## Installation

You can install the Senti Client library using npm:

```bash
npm install senti-client
```
## How to start

```javascript
const { SentiClient } = require("senti_client");

// Creating a new client instance
const senti = new SentiClient();

//set bot token and command prefix
const bot_token = "YOUR_DISCORD_BOT_TOKEN";
const prefix = ">";

let options = {
    intents: 32767
}

//execute when bot is ready
senti.once("ready", (client) => {
    console.log(client.user.username + " is ready")
});

//execute when user send message
senti.on("messageCreate", (message, obj) => {
    console.log(message.content);
});

//connect bot to discord servers
senti.connect(bot_token, options);
```

//lib local instal
/*
/src -> npm link
/test -> npm link senti_client
*/


const { SentiClient, SlashCommandManager } = require("senti_client");
const config = require("./config.json")
//commands
const handler = require("./handlers/handler")
const msg_handler = require("./handlers/msg_handler")

// (/) commands
const slashCommandsHandler = require("./handlers/slashCommandHandler")

const eventsHandler = require("./handlers/eventsHandler")

async function main() {
  const bot_token = config.token;
  const prefix = ">";

  const senti = new SentiClient();
  const commandManager = new SlashCommandManager(bot_token);

  let options = {
    intents: 32767
  }

  senti.once("ready", (client) => {
    console.log(client.user.username + " is ready")
    slashCommandsHandler(commandManager, senti)
  });

  handler(senti)

  senti.on("messageCreate", (message, obj) => {
    console.log(message.content);

    msg_handler(message, senti, prefix);
    // console.log(obj)
  });

  senti.on('INTERACTION_CREATE', async (interaction) => {
    const mySlashCollection = global.slashCollection
    if (interaction.type == 2) {
      if (mySlashCollection.has(interaction.data.name)) {
        const name = interaction.data.name
        senti.interaction_reply(interaction, mySlashCollection.get(name))
      }
    }
  });

  //recive Events
  eventsHandler(senti);

  senti.connect(bot_token, options);
}

main();
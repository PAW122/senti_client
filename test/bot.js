const { SentiClient, SlashCommandManager } = require("senti_client");
//commands
const handler = require("./handlers/handler")
const msg_handler = require("./handlers/msg_handler")

const eventsHandler = require("./handlers/eventsHandler")

async function main() {
  const bot_token = "Nzk3MDcwODA2ODg1OTkwNDMx.GMK9g0.IMdFMHuph15iJrYiH-6eM9K_y7LW984ioZYvqw";
  const prefix = ">";

  const senti = new SentiClient();
  const commandManager = new SlashCommandManager(bot_token);

  let options = {
    intents: 32767
  }

  senti.once("ready", (client) => {
    console.log(client.user.username + " is ready")

    require("./slashCommands/slash_command")(commandManager, client)

  })

  handler(senti)

  senti.on("messageCreate", (message, obj) => {
    console.log(message.content)

    msg_handler(message, senti, prefix)
    // console.log(obj)

  })

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
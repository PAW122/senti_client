const { SentiClient, Collection, EmbedMessage } = require("senti_client");
const handler = require("./handlers/handler")
const msg_handler = require("./handlers/msg_handler")
const eventsHandler = require("./handlers/eventsHandler")

async function main() {
  const bot_token = "Nzk3MDcwODA2ODg1OTkwNDMx.GMK9g0.IMdFMHuph15iJrYiH-6eM9K_y7LW984ioZYvqw";
  const prefix = ">";

  const senti = await new SentiClient();

  senti.once("ready", (client) => {
    console.log(client.user.username + " is ready")
  })

  handler(senti)

  senti.on("messageCreate", (message, obj) => {
    console.log(message.content)

    msg_handler(message, senti, prefix)
    // console.log(obj)

    if(message.content == "delet") {
      senti.MESSAGE_DELETE("745768777022701648","1138942993601155103")
    }
  })

  //recive Events
  eventsHandler(senti);


  senti.connect(bot_token);
}

main();
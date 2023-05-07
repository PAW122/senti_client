const { SentiClient, Collection } = require("senti_client");
const handler = require("./handlers/handler")
const msg_handler = require("./handlers/msg_handler")

async function main() {
  const bot_token = "ODY5NTg3ODc3NDc3MTAxNTkw.GlmFPn._B9qisZ6doLQy17z553CpyGwHQ501-Fln1oeO4";
  const prefix = ">";

  const senti = await new SentiClient();

  senti.once("ready", (client) => {
    console.log(client.user.username + " is ready")
  })

  handler(senti)

  senti.on("messageCreate", (message, obj) => {
    console.log(message.content)

    msg_handler(message,senti,prefix)
  })

  senti.connect(bot_token);

}

main();

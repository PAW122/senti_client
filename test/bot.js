const { SentiClient, Collection, EmbedMessage } = require("senti_client");
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

    msg_handler(message, senti, prefix)
  })

  senti.connect(bot_token);

  // //wysyłanie testowego embeda:
  // // tworzenie obiektu EmbedMessage
  // const embed = new EmbedMessage()
  //   .setTitle("Tytuł")
  //   .setColor(0xff0000)
  //   .setDescription("Opis")
  //   .addField("Pole 1", "Wartość 1")

  // // wysyłanie wiadomości z embedem za pomocą funkcji sendWithEmbed
  // senti.sendEmbed("745768777022701648", embed.getEmbed());

  // console.log(embed.getEmbed())
  // console.log("_______________________________________________________________________________________________")
  
}

main();


// {
//   title: 'Tytuł',
//   description: 'Opis',
//   color: '',
//   fields: [ { name: 'Pole 1', value: 'Wartość 1', inline: false } ],
//   footer: { text: '', icon_url: '' }
// }
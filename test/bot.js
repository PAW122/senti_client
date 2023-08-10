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
                          //channel_id          message_id
      senti.MESSAGE_DELETE("745768777022701648","1138942993601155103")
    }

    if(message.content == "edit") {
                            //channel_id          message_id              new message content
      senti.MESSAGE_UPDATE("745768777022701648", "1139310802462064660", "3wiadomość zedytowana")
    }

    if(message.content == "bulk") {
                               //channel_id               list of messages id to delete
      senti.MESSAGE_DELETE_BULK("745768777022701648", ["1139314228579291136","1139314230131175524"])
    }

    if(message.content == "reaction+") {
                               //channel_id            message_id           reaction
      senti.MESSAGE_REACTION_ADD("745768777022701648","1139315421133152408","✅")
    }

    if(message.content == "reaction-") {
                                //channel_id            message_id           reaction
      senti.MESSAGE_REACTION_REMOVE("745768777022701648","1139315421133152408","✅")
    }

    if(message.content == "reaction--") {
                                  //channel_id            message_id
      senti.MESSAGE_REACTION_REMOVE_ALL("745768777022701648","1139315421133152408")
    }

    if(message.content == "reaction-?") {
                                    //channel_id            message_id                  emoji
      senti.MESSAGE_REACTION_REMOVE_EMOJI("745768777022701648", "1139315421133152408", "✅")
    }
    
  })

  //recive Events
  eventsHandler(senti);


  senti.connect(bot_token);
}

main();
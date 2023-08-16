const { SentiClient, Collection, EmbedMessage, SlashCommandManager } = require("senti_client");
const handler = require("./handlers/handler")
const msg_handler = require("./handlers/msg_handler")
const eventsHandler = require("./handlers/eventsHandler")

async function main() {
  const bot_token = "Nzk3MDcwODA2ODg1OTkwNDMx.GMK9g0.IMdFMHuph15iJrYiH-6eM9K_y7LW984ioZYvqw";
  const prefix = ">";

  const senti = await new SentiClient();
  const commandManager = new SlashCommandManager(bot_token);

  senti.once("ready", (client) => {
    console.log(client.user.username + " is ready")

    require("./slashCommands/slash_command")(commandManager, client)

  })

  handler(senti)

  senti.on("messageCreate", (message, obj) => {
    console.log(message.content)

    msg_handler(message, senti, prefix)
    // console.log(obj)

    if (message.content == "delet") {
      //channel_id          message_id
      senti.MESSAGE_DELETE("745768777022701648", "1138942993601155103")
    }

    if (message.content == "edit") {
      //channel_id          message_id              new message content
      senti.MESSAGE_UPDATE("745768777022701648", "1139586581603291288", "wiadomość zedytowana")
    }

    if (message.content == "bulk") {
      //channel_id               list of messages id to delete
      senti.MESSAGE_DELETE_BULK("745768777022701648", ["1139314228579291136", "1139314230131175524"])
    }

    if (message.content == "reaction+") {
      //channel_id            message_id           reaction
      senti.MESSAGE_REACTION_ADD("745768777022701648", "1139315421133152408", "✅")
    }

    if (message.content == "reaction-") {
      //channel_id            message_id           reaction
      senti.MESSAGE_REACTION_REMOVE("745768777022701648", "1139315421133152408", "✅")
    }

    if (message.content == "reaction--") {
      //channel_id            message_id
      senti.MESSAGE_REACTION_REMOVE_ALL("745768777022701648", "1139315421133152408")
    }

    if (message.content == "reaction-?") {
      //channel_id            message_id                  emoji
      senti.MESSAGE_REACTION_REMOVE_EMOJI("745768777022701648", "1139315421133152408", "✅")
    }

    if (message.content == "idle") {
      //client id   online status
      senti.PRESENCE_UPDATE(senti.user.id, "offline")
    }

    if (message.content == "type") {
      //channel id
      senti.TYPING_START("745768777022701648")
    }

    if (message.content == "ban") {

      const guild_id = '727662119553728532';
      const user_id = '778643150981562368';

      senti.getFullUserInfo(user_id)
        .then(user => {
          senti.GUILD_BAN_ADD(guild_id, user)
            .catch(error => {
              console.error("Wystąpił błąd przy dodawaniu bana:", error.message);
            });
        })
        .catch(error => {
          console.error("Wystąpił błąd przy pobieraniu informacji o użytkowniku:", error.message);
        });
    }

    if (message.content == "unban") {
      const guild_id = '727662119553728532';
      const user_id = '778643150981562368';

      senti.getFullUserInfo(user_id)
        .then(user => {
          senti.GUILD_BAN_REMOVE(guild_id, user)
            .catch(error => {
              console.error("Wystąpił błąd przy usówaniu bana:", error.message);
            });
        })
        .catch(error => {
          console.error("Wystąpił błąd przy pobieraniu informacji o użytkowniku:", error.message);
        });
    }

    if (message.content == "make_role") {
      const role_data = {
        name: 'Test Role',
        color: 0x00ff00,
        permissions: 1234567890
      };
      senti.GUILD_ROLE_CREATE("727662119553728532", role_data)
    }

    if (message.content == "role_update") {
      const updated_role_data = {
        name: 'Test Role-updated',
        color: 0x00ff00,
        permissions: 1234567890
      };
      senti.GUILD_ROLE_UPDATE("727662119553728532", "1140089406242426930", updated_role_data)
    }

    if (message.content == "role_delete") {
      senti.GUILD_ROLE_DELETE("727662119553728532", "1140089406242426930")
    }

    if (message.content == "invite_delete") {
      senti.INVITE_DELETE("B6FebeJk")
    }

    if (message.content == "invite_create") {
      const channel_id = "745768777022701648"
      senti.INVITE_CREATE(channel_id, 10, 1000)
        .then(res => {
          senti.send(channel_id, `https://discord.gg/${res.code}`)
        })
    }

    if (message.content == "channel_create") {
      const channel_data = {
        name: 'Nowy Kanał',
        type: 0 // Typ kanału (0 oznacza kanał tekstowy, 2 oznacza głosowy)
      };
      senti.CHANNEL_CREATE("727662119553728532", channel_data)
    }

    if (message.content == "channel_update") {
      const updated_data = {
        name: 'Nowa Nazwa Kanału'
      };
      senti.CHANNEL_UPDATE("1086447865066442823", updated_data)
    }

    if (message.content == "channel_delete") {
      senti.CHANNEL_DELETE("1086447863808151603")
    }

  })

  senti.on('INTERACTION_CREATE', async (interaction) => {
    // Obsługa komend slash
    console.log(interaction)
    if (interaction.type == 2) {
      if (interaction.data.name === 'blep') {

        const reason = 'Sample response';
        const embed_worker = new EmbedMessage()
            .setTitle('**8ball**')
            .setDescription("test")
            .setColor('RANDOM')
            .setDescription(`${reason}`);

        senti.interaction_reply(interaction,embed_worker.getEmbed())
        // Tutaj obsługuj wywołanie slash command "blep"
        // Możesz użyć interaction.reply() aby wysłać odpowiedź do użytkownika
      }
    }
  });

  //recive Events
  eventsHandler(senti);

  senti.connect(bot_token);
}

main();
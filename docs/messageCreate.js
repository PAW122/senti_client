/*
    messageCreate -> message -> object
    

    message data map ->

    id: unique identifier of the message
    channel_id: the ID of the channel where the message was sent
    content: content of the message
    author: User object representing the author of the message ->  {

        id: unique user ID
        username: username
        discriminator: The user's four-digit discriminator number
        avatar: ID of the user's avatar image
        bot: true if the user is a bot, otherwise false

    }

    timestamp: date and time the message was sent
    edited_timestamp: date and time when the message was last edited, null if the message was not edited
    tts: true if the message was sent as text-to-speech, otherwise false
    mention_everyone: true if the message mentions every user in the feed, otherwise false
    mentions: an array of User objects representing the users that have been mentioned in the message
    attachments: an array of Attachment objects representing message attachments such as images, files, etc.
    embeds: an array of Embed objects representing embedded content in the message
    reactions: an array of Reaction objects representing reactions to the message

    message = [object Object]
    obj = [object Object] to json

    example usage:
*/

async function main() {
    const bot_token = "";
    const senti = await new senti_client();

    senti.on("ready", (client) => {
        console.log("bot is ready")
    })

    senti.on("messageCreate", (message,obj) => {
        console.log(`messageCreate: ${message.content}`)
    })

    senti.connect(bot_token)

}
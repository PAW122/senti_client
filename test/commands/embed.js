const { EmbedMessage } = require("senti_client");

module.exports = {
    name: "embed",

    execute: async (message, args,senti) => {

        const embed = new EmbedMessage()
            .setTitle("Tytuł")
            .setColor(0xff0000)
            .setDescription("Opis")
            .addField("Pole 1", "Wartość 1")
            .setUrl("https://www.youtube.com/channel/UC-rjBSJ-RTaT7GchTgV50Eg")
            .setFooter("text", "https://yt3.googleusercontent.com/ytc/AOPolaTeSO7Fs2O-cGKD4VCq3SniQLcBBVYSMnzOX577=s176-c-k-c0x00ffffff-no-rj")
            .setImage("https://yt3.googleusercontent.com/ytc/AOPolaTeSO7Fs2O-cGKD4VCq3SniQLcBBVYSMnzOX577=s176-c-k-c0x00ffffff-no-rj", null, 100,100)
            .setThumbnail("https://yt3.googleusercontent.com/ytc/AOPolaTeSO7Fs2O-cGKD4VCq3SniQLcBBVYSMnzOX577=s176-c-k-c0x00ffffff-no-rj", null, 200, 200)
            .setTimestamp("2023-08-05T23:19:17.931000+00:00")
            .setProvider("name", "https://google.com")

        senti.sendEmbed(message.channel_id, embed.getEmbed());  
    }

}
class EmbedMessage {
    constructor() {
        this.embed = {
            title: "",
            description: "",
            url: "",
            color: "",
            fields: [],
            footer: null,
            image: null,
            thumbnail: null,
            video: null,
            provider: null,
            author: null,
            timestamp: ""
        };
    }

    setTitle(title) {
        this.embed.title = title;
        return this;
    }

    setDescription(description) {
        this.embed.description = description;
        return this;
    }

    setUrl(url) {
        this.embed.url = url
        return this
    }

    setColor(color) {
        this.embed.color = color;
        return this;
    }

    addField(name, value, inline = false) {
        this.embed.fields.push({ name, value, inline });
        return this;
    }

    setFooter(text, iconUrl) {
        this.embed.footer = {
            text: text || null,
            icon_url: iconUrl || null
        }
        return this;
    }

    setImage(url, proxyUrl, height, width) {
        this.embed.image = {
            url: url,
            proxy_url: proxyUrl || null,
            height: height || null,
            width: width || null
        };
        return this;
    }

    setThumbnail(url, proxyUrl, height, width) {
        this.embed.thumbnail = {
            url: url,
            proxy_url: proxyUrl || null,
            height: height || null,
            width: width || null
        };
        return this;
    }

    setVideo(url, proxyUrl, height, width) {
        this.embed.video = {
            url: url,
            proxy_url: proxyUrl || null,
            height: height || null,
            width: width || null
        };
        return this;
    }

    setProvider(name,url) {
        this.embed.provider = {
            name: name,
            url: url
        };
        return this
    }

    setTimestamp(timestamp) {
        this.embed.timestamp = timestamp;
        return this;
    }

    setAuthor(name,url,icon_url,proxy_icon_url) {
        this.embed.author = {
            name: name,
            url: url || null,
            icon_url: icon_url || null,
            proxy_icon_url: proxy_icon_url || null
        };
        return this
    }

    getEmbed() {
        const embed = { ...this.embed };
        // Remove any null or empty properties from the embed object
        for (const [key, value] of Object.entries(embed)) {
            if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
                delete embed[key];
            }
        }
        return embed;
    }
}

module.exports = EmbedMessage;
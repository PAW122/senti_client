/**
 * EmbedMessage
 * @function setType - set type of message
 * @function setTitle - set title
 * @function setDescription - set description
 * @function setUrl - add url
 * @function setColor - set bar color
 * @function addFields - add multiple fields
 * @function setFooter - set fotter
 * @function setImage - add image
 * @function setThumbnail - set thumbnail
 * @function setVideo - add video
 * @function setProvider - set provider
 * @function setTimestamp - set timesamp (date)
 * @function setAuthor - set author
 * @function getEmbed - get formated json embed message (needed to send to discord)
 */
class EmbedMessage {
    constructor() {
        this.embed = {
            type: "rich",
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

    /**
     * type of message
     * @param {string / number} type
     * @returns {object} - return object
     */
    setType(type) {
        this.type = type;
        return this;
    }

    /**
     * 
     * @param {string} title - String contains title off embed message 
     * @returns {object}
     */
    setTitle(title) {
        this.embed.title = title;
        return this;
    }

    /**
     * 
     * @param {string} description - description off embed message 
     * @returns {object}
     */
    setDescription(description) {
        this.embed.description = description;
        return this;
    }

    /**
     * add url to embed
     * @param {string} url 
     * @returns {object}
     */
    setUrl(url) {
        this.embed.url = url
        return this
    }

    /**
     * set a color for bar on left side of message
     * @param {color} color - color value
     * @returns 
     */
    setColor(color) {
        this.embed.color = color;
        return this;
    }

    /**
     * 
     * @param {string} name - field title 
     * @param {string} value - field discription
     * @param {boolean} inline - inline to last field?
     * @returns 
     */
    addFields(name, value, inline = false) {
        this.embed.fields.push({ name, value, inline });
        return this;
    }

    /**
     * 
     * @param {string} text - text  
     * @param {string} iconUrl - icon for example user avatar
     * @returns 
     */
    setFooter(text, iconUrl) {
        this.embed.footer = {
            text: text || null,
            icon_url: iconUrl || null
        }
        return this;
    }

    /**
     * add Image
     * @param {string} url - link 
     * @param {string} proxyUrl - proxy link
     * @param {number} height - height
     * @param {number} width - width
     * @returns 
     */
    setImage(url, proxyUrl, height, width) {
        this.embed.image = {
            url: url,
            proxy_url: proxyUrl || null,
            height: height || null,
            width: width || null
        };
        return this;
    }

    /**
     * add Thumbnail
     * @param {string} url - link 
     * @param {string} proxyUrl - proxy link
     * @param {number} height - height
     * @param {number} width - width
     * @returns 
     */
    setThumbnail(url, proxyUrl, height, width) {
        this.embed.thumbnail = {
            url: url,
            proxy_url: proxyUrl || null,
            height: height || null,
            width: width || null
        };
        return this;
    }
    
    /**
     * add Video
     * @param {string} url - link 
     * @param {string} proxyUrl - proxy link
     * @param {number} height - height
     * @param {number} width - width
     * @returns 
     */
    setVideo(url, proxyUrl, height, width) {
        this.embed.video = {
            url: url,
            proxy_url: proxyUrl || null,
            height: height || null,
            width: width || null
        };
        return this;
    }

    /**
     * add Provider
     * @param {string} name 
     * @param {string} url 
     * @returns 
     */
    setProvider(name,url) {
        this.embed.provider = {
            name: name,
            url: url
        };
        return this
    }

    /**
     * add Timesamp
     * @param {timestamp} timestamp - date
     * @returns 
     */
    setTimestamp(timestamp) {
        this.embed.timestamp = timestamp;
        return this;
    }

    /**
     * add author data
     * @param {string} name 
     * @param {string} url 
     * @param {string} icon_url 
     * @param {string} proxy_icon_url 
     * @returns 
     */
    setAuthor(name,url,icon_url,proxy_icon_url) {
        this.embed.author = {
            name: name,
            url: url || null,
            icon_url: icon_url || null,
            proxy_icon_url: proxy_icon_url || null
        };
        return this
    }

    /**
     * return embed object us json thats ready to use and send to discord
     * @returns {JSON} - formated json embed message
     */
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
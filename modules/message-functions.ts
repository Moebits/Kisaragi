var botOwner = false;
var administrator = false;
var moderator = false;

var adminPermissions = ["ADMINISTRATOR"];
var modPermissions = ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES"];

module.exports = (client, message) => {

    let ownerID = process.env.OWNER_ID;
    let Discord = require("discord.js");
    let config = require("../../config.json");
    let prefix = config.prefix;
    let colors = config.colors;

    //Response Time
    client.responseTime = () => {
        return `${Date.now() - message.createdTimestamp} ms`;
    }

    //Get Emoji
    client.getEmoji = (name) => {
        for (var i in config.emojis) {
            if (name === config.emojis[i].name) {
                return client.emojis.find(emoji => emoji.id === config.emojis[i].id);
            }
        }
    }
    

    //Random Color
    client.randomColor = () => {
        return parseInt(colors[Math.floor(Math.random() * colors.length)]);
    }

    //Create Embed
    client.createEmbed = () => {
        var embed = new Discord.RichEmbed();
            embed
            .setColor(client.randomColor())
            .setTimestamp(embed.timestamp)
            .setFooter(`Responded in ${client.responseTime()}`, message.author.avatarURL);
            return embed;
    }

    //Check for Bot Owner
    client.checkBotOwner = () => {
        if (message.author.id === ownerID) {
            return true;
        } else {
            return false;
        }
    }

    //Create Permission
    client.createPermission = (permission) => {
        var perm = new Discord.Permissions(permission);
        return perm;
    }

    //Check for Bot Mention
    client.checkBotMention = (message) => {
        if (message.content.includes("<@!593838271650332672>")) {
            return true;
        }
    }

    //Check for Prefix and User
    client.checkPrefixUser = (message) => {
        if(!message.content.startsWith(prefix) || message.author.bot) {
            return true;
        }
    }

    //Combine args after an index
    client.combineArgs = (args, num) => {
        var combined = "";
        for (var i = num; i < args.length; i++) {
            combined += args[i] + " ";
        }
        return combined;
    }
}
module.exports = (client: any, message: any) => {

    let ownerID: string = process.env.OWNER_ID;
    let Discord: any = require("discord.js");
    let config: any = require("../../config.json");
    let prefix: string = config.prefix;
    let colors: string[] = config.colors;
    
    //Random Number
    client.getRandomNum = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
    }

    //Response Time
    client.responseTime = () => {
        return `${Date.now() - message.createdTimestamp} ms`;
    }

    //Get Emoji
    client.getEmoji = (name: string) => {
        for (let i in config.emojis) {
            if (name === config.emojis[i].name) {
                return client.emojis.find((emoji: any) => emoji.id === config.emojis[i].id);
            }
        }
    }

    //Random Color
    client.randomColor = () => {
        return parseInt(colors[Math.floor(Math.random() * colors.length)]);
    }

    //Create Embed
    client.createEmbed = () => {
        let embed: any = new Discord.RichEmbed();
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
    client.createPermission = (permission: string) => {
        let perm: any = new Discord.Permissions(permission);
        return perm;
    }

    //Check for Bot Mention
    client.checkBotMention = (message: any) => {
        if (message.content.startsWith("<@!593838271650332672>")) {
            return true;
        }
    }

    //Check for Prefix and User
    client.checkPrefixUser = (message: any) => {
        if(!message.content.startsWith(prefix) || message.author.bot) {
            return true;
        }
    }

    //Combine args after an index
    client.combineArgs = (args: string[], num: number) => {
        let combined: string = "";
        for (let i = num; i < args.length; i++) {
            combined += args[i] + " ";
        }
        return combined;
    }
}
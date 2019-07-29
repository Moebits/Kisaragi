exports.run = async (client: any, message: any, args: string[]) => {
    if (args[1]) {
        let helpDir = require("./help commands.js");
        await helpDir.run(client, message, args);
        return;
    }
    const helpInfo: any = client.createEmbed();
        helpInfo
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        //.setImage("https://i.imgur.com/Av9RN7x.png")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Info Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**avatar** _mentions_\n` +
            `Posts the avatar image of the user(s).\n` +
            `${client.getEmoji("star")}**emoji** name/id/emoji\n` +
            `Posts the emoji image of an emoji.\n` +
            `${client.getEmoji("star")}**guild icon**\n` +
            `Posts your guild's icon image.\n` +
            `${client.getEmoji("star")}**ping**\n` +
            `Posts the response time and API latency.\n` +
            `${client.getEmoji("star")}**prefix**\n` +
            `Does not work yet\n` 
        )
    const helpLevel: any = client.createEmbed();
        helpLevel
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Level Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**give** mention/id\n` +
            `Does not work yet\n` +
            `${client.getEmoji("star")}**rank** _mention_\n` +
            `Does not work yet\n` +
            `${client.getEmoji("star")}**top**\n` +
            `Does not work yet\n`
        )
    const helpHeart: any = client.createEmbed();
        helpHeart
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Heart Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**baka** _mention_\n` +
            `Call someone a baka.\n` +
            `${client.getEmoji("star")}**cuddle** _mention_\n` +
            `Cuddle someone.\n` +
            `${client.getEmoji("star")}**hug** _mention_\n` +
            `Hug someone.\n` +
            `${client.getEmoji("star")}**kiss** _mention_\n` +
            `Kiss someone.\n` +
            `${client.getEmoji("star")}**pat** _mention_\n` +
            `Pat someone.\n` +
            `${client.getEmoji("star")}**poke** _mention_\n` +
            `Poke someone.\n` +
            `${client.getEmoji("star")}**slap** _mention_\n` +
            `Slap someone.\n` +
            `${client.getEmoji("star")}**smug** _mention_\n` +
            `Post a smug image/gif.\n` +
            `${client.getEmoji("star")}**tickle** _mention_\n` +
            `Tickle someone.\n`
        )
    const helpAnime: any = client.createEmbed();
        helpAnime
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Anime Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**anime** anime\n` +
            `Gets an anime's description.\n` +
            `${client.getEmoji("star")}**animequote** _anime/character_\n` +
            `Posts an anime quote.\n` +
            `${client.getEmoji("star")}**danbooru** <r18> _tag_\n` +
            `Searches danbooru.\n` +
            `${client.getEmoji("star")}**gelbooru** <r18> _tag_\n` +
            `Searches gelbooru.\n` +
            `${client.getEmoji("star")}**kitsune** <lewd>\n` +
            `Posts a kitsune girl image.\n` +
            `${client.getEmoji("star")}**konachan** <r18> _tag_\n` +
            `Searches konachan.\n` +
            `${client.getEmoji("star")}**loli** <hentai>\n` +
            `Does not work yet.\n` +
            `${client.getEmoji("star")}**lolibooru** <r18> _tag_\n` +
            `Searches lolibooru.\n` +
            `${client.getEmoji("star")}**manga** manga\n` +
            `Gets a manga's description.\n` +
            `${client.getEmoji("star")}**neko** <lewd>\n` +
            `Posts a neko girl image.\n` +
            `${client.getEmoji("star")}**pixiv** <r18> <en> _tag/id_\n` +
            `Searches for a pixiv image.\n` +
            `${client.getEmoji("star")}**ugoira** <r18> <en> _tag/id_\n` +
            `Searches for a pixiv ugoira.\n` +
            `${client.getEmoji("star")}**yandere** <r18> _tag_\n` +
            `Searches yandere.\n` 
        )
    const helpOsu: any = client.createEmbed();
        helpOsu
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Osu Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**osu** player\n` +
            `Gets an osu player's profile.\n`
        )
    const helpGeometry: any = client.createEmbed();
        helpGeometry
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Geometry Dash Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**level** name/id\n` +
            `Does not work yet.\n`
        )
    const helpJapanese: any = client.createEmbed();
        helpJapanese
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Japanese Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**furigana** text\n` +
            `Adds furigana to the input text.\n` +
            `${client.getEmoji("star")}**hiragana** text\n` +
            `Converts input text to hiragana.\n` +
            `${client.getEmoji("star")}**japanese** text\n` +
            `Translates from japanese to english and vice versa.\n` +
            `${client.getEmoji("star")}**katakana** text\n` +
            `Converts input text to katakana\n` +
            `${client.getEmoji("star")}**romaji** text\n` +
            `Converts input text to romaji.\n` 
        )
    const helpFun: any = client.createEmbed();
        helpFun
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Fun Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**ascii** text\n` +
            `Posts ascii art of the input text.\n` +
            `${client.getEmoji("star")}**emojify** text\n` +
            `Posts input text in emoji letters.\n` +
            `${client.getEmoji("star")}**say** text\n` +
            `Posts the input text.\n` 
        )
    const helpUtil: any = client.createEmbed();
        helpUtil
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Utility Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**holiday**\n` +
            `Does not work yet.\n` +
            `${client.getEmoji("star")}**nasa**\n` +
            `Posts the astronomy picture of the day.\n` +
            `${client.getEmoji("star")}**photos**\n` +
            `Does not work yet.\n` +
            `${client.getEmoji("star")}**remdash**\n` +
            `Does not work yet.\n` 
        )
    const helpHentai: any = client.createEmbed();
        helpHentai
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Hentai Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**fakku**\n` +
            `Does not work yet.\n` +
            `${client.getEmoji("star")}**lewdme**\n` +
            `Why do you want to lewd me?\n` +
            `${client.getEmoji("star")}**nhentai** <random> _tag/id_\n` +
            `Gets a doujin from nhentai.\n` +
            `${client.getEmoji("star")}**rule34** <r18>\n` +
            `Searches rule34.\n` 
        )
    const helpMusic: any = client.createEmbed();
        helpMusic
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Music Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**play**\n` +
            `Does not work yet.\n` 
        )
    const helpRole: any = client.createEmbed();
        helpRole
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Role Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**role add/del** _user/id_\n` +
            `Adds or removes a role from the specified user.\n`  
        )
    const helpMod: any = client.createEmbed();
        helpMod
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Moderator Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**ban** user/id\n` +
            `Bans the specified user.\n` +
            `${client.getEmoji("star")}**del** number\n` +
            `Deletes an amount of messages (1-1000).\n` +
            `${client.getEmoji("star")}**kick** _user/id_\n` +
            `Kicks the specified user.\n` +
            `${client.getEmoji("star")}**unban** _user/id_\n` +
            `Unbans the specified user.\n` 
        )
    const helpAdmin: any = client.createEmbed();
        helpAdmin
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Administrator Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**n/a**\n` +
            `N/A\n`  
        )
    const helpLogging: any = client.createEmbed();
        helpLogging
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Logging Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**n/a**\n` +
            `N/A\n`  
        )
    const helpConfig: any = client.createEmbed();
        helpConfig
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Configuration Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**n/a**\n` +
            `N/A\n`  
        )
    const helpBotOwner: any = client.createEmbed();
        helpBotOwner
        .setAuthor("help","https://cdn.discordapp.com/emojis/579856442551697418.gif")
        .setThumbnail(message.author.avatarURL)
        .setTitle(`Bot Developer Commands ${client.getEmoji("gabTired")}`)
        .setDescription(
            `${client.getEmoji("star")}**createguild** name region\n` +
            `Does not work yet.\n` +
            `${client.getEmoji("star")}**eval** code\n` +
            `Evaluates javascript code.\n` +
            `${client.getEmoji("star")}**reboot**\n` +
            `Does not work yet.\n` +
            `${client.getEmoji("star")}**reload** command\n` +
            `Reloads a command.\n` +
            `${client.getEmoji("star")}**set** status text\n` +
            `Set's the bots activity.\n`
        )

    client.createReactionEmbed([helpInfo, helpLevel, helpHeart, helpAnime, helpOsu, helpGeometry, helpJapanese,
    helpFun, helpUtil, helpHentai, helpMusic, helpRole, helpMod, helpAdmin, helpLogging, helpConfig, helpBotOwner]);
    
}
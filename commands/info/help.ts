import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Help extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        if (args[1]) {
            const helpDir = require("./help commands.js")
            await helpDir.run(discord, message, args)
            return
        }
        const helpInfo = embeds.createEmbed()
        helpInfo
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            // .setImage("https://i.imgur.com/Av9RN7x.png")
            .setThumbnail(message.author!!.displayAvatarURL())
            .setTitle(`Info Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**avatar** _mentions_\n` +
                `Posts the avatar image of the user(s).\n` +
                `\n` +
                `${discord.getEmoji("star")}**emoji** name/id/emoji\n` +
                `Posts the emoji image of an emoji.\n` +
                `\n` +
                `${discord.getEmoji("star")}**guild icon**\n` +
                `Posts your guild's icon image.\n` +
                `\n` +
                `${discord.getEmoji("star")}**ping**\n` +
                `Posts the response time and API latency.\n` +
                `\n` +
                `${discord.getEmoji("star")}**prefix**\n` +
                `Does not work yet\n`
            )
        const helpLevel = embeds.createEmbed()
        helpLevel
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Level Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**give** mention/id\n` +
                `Does not work yet\n` +
                `\n` +
                `${discord.getEmoji("star")}**rank** _mention_\n` +
                `Does not work yet\n` +
                `\n` +
                `${discord.getEmoji("star")}**top**\n` +
                `Does not work yet\n`
            )
        const helpHeart = embeds.createEmbed()
        helpHeart
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Heart Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**baka** _mention_\n` +
                `Call someone a baka.\n` +
                `\n` +
                `${discord.getEmoji("star")}**cuddle** _mention_\n` +
                `Cuddle someone.\n` +
                `\n` +
                `${discord.getEmoji("star")}**hug** _mention_\n` +
                `Hug someone.\n` +
                `\n` +
                `${discord.getEmoji("star")}**kiss** _mention_\n` +
                `Kiss someone.\n` +
                `\n` +
                `${discord.getEmoji("star")}**pat** _mention_\n` +
                `Pat someone.\n` +
                `\n` +
                `${discord.getEmoji("star")}**poke** _mention_\n` +
                `Poke someone.\n` +
                `\n` +
                `${discord.getEmoji("star")}**slap** _mention_\n` +
                `Slap someone.\n` +
                `\n` +
                `${discord.getEmoji("star")}**smug** _mention_\n` +
                `Post a smug image/gif.\n` +
                `\n` +
                `${discord.getEmoji("star")}**tickle** _mention_\n` +
                `Tickle someone.\n`
            )
        const helpAnime = embeds.createEmbed()
        helpAnime
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Anime Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**anime** anime\n` +
                `Gets an anime's description.\n` +
                `\n` +
                `${discord.getEmoji("star")}**animequote** _anime/character_\n` +
                `Posts an anime quote.\n` +
                `\n` +
                `${discord.getEmoji("star")}**danbooru** <r18> _tag_\n` +
                `Searches danbooru.\n` +
                `\n` +
                `${discord.getEmoji("star")}**gelbooru** <r18> _tag_\n` +
                `Searches gelbooru.\n` +
                `\n` +
                `${discord.getEmoji("star")}**kitsune** <lewd>\n` +
                `Posts a kitsune girl image.\n` +
                `\n` +
                `${discord.getEmoji("star")}**konachan** <r18> _tag_\n` +
                `Searches konachan.\n` +
                `\n` +
                `${discord.getEmoji("star")}**loli** <hentai>\n` +
                `Does not work yet.\n` +
                `\n` +
                `${discord.getEmoji("star")}**lolibooru** <r18> _tag_\n` +
                `Searches lolibooru.\n` +
                `\n` +
                `${discord.getEmoji("star")}**manga** manga\n` +
                `Gets a manga's description.\n` +
                `\n` +
                `${discord.getEmoji("star")}**neko** <lewd>\n` +
                `Posts a neko girl image.\n` +
                `\n` +
                `${discord.getEmoji("star")}**pixiv** <r18> <en> _tag/id_\n` +
                `Searches for a pixiv image.\n` +
                `\n` +
                `${discord.getEmoji("star")}**ugoira** <r18> <en> _tag/id_\n` +
                `Searches for a pixiv ugoira.\n` +
                `\n` +
                `${discord.getEmoji("star")}**yandere** <r18> _tag_\n` +
                `Searches yandere.\n`
            )
        const helpHentai = embeds.createEmbed()
        helpHentai
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Hentai Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**fakku**\n` +
                `Does not work yet.\n` +
                `\n` +
                `${discord.getEmoji("star")}**lewdme**\n` +
                `Why do you want to lewd me?\n` +
                `\n` +
                `${discord.getEmoji("star")}**nhentai** <random> _tag/id_\n` +
                `Gets a doujin from nhentai.\n` +
                `\n` +
                `${discord.getEmoji("star")}**rule34** <r18>\n` +
                `Searches rule34.\n`
            )
        const helpOsu = embeds.createEmbed()
        helpOsu
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Osu Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**osu** player\n` +
                `Gets an osu player's profile.\n`
            )
        const helpGeometry = embeds.createEmbed()
        helpGeometry
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Geometry Dash Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**level** name/id\n` +
                `Does not work yet.\n`
            )
        const helpJapanese = embeds.createEmbed()
        helpJapanese
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Japanese Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**furigana** text\n` +
                `Adds furigana to the input text.\n` +
                `\n` +
                `${discord.getEmoji("star")}**hiragana** text\n` +
                `Converts input text to hiragana.\n` +
                `\n` +
                `${discord.getEmoji("star")}**japanese** text\n` +
                `Translates from japanese to english and vice versa.\n` +
                `\n` +
                `${discord.getEmoji("star")}**katakana** text\n` +
                `Converts input text to katakana\n` +
                `\n` +
                `${discord.getEmoji("star")}**romaji** text\n` +
                `Converts input text to romaji.\n`
            )
        const helpWeb = embeds.createEmbed()
        helpWeb
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Website Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**giphy** _tag_\n` +
                `Searches giphy.\n` +
                `\n` +
                `${discord.getEmoji("star")}**google** text\n` +
                `Searches google.\n` +
                `\n` +
                `${discord.getEmoji("star")}**images** text\n` +
                `Searches google images.\n` +
                `\n` +
                `${discord.getEmoji("star")}**imgur** _tag_\n` +
                `Searches imgur.\n` +
                `\n` +
                `${discord.getEmoji("star")}**soundcloud** _tag_\n` +
                `Does not work yet.\n` +
                `\n` +
                `${discord.getEmoji("star")}**tenor** _tag_\n` +
                `Searches tenor.\n` +
                `\n` +
                `${discord.getEmoji("star")}**urban** _text_\n` +
                `Searches urban dictionary.\n` +
                `\n` +
                `${discord.getEmoji("star")}**xkcd** _id_\n` +
                `Gets an xkcd comic.\n` +
                `\n` +
                `${discord.getEmoji("star")}**youtube** <video/channel/playlist> text\n` +
                `Searches youtube.\n`
            )
        const helpFun = embeds.createEmbed()
        helpFun
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Fun Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**ascii** text\n` +
                `Posts ascii art of the input text.\n` +
                `\n` +
                `${discord.getEmoji("star")}**emojify** text\n` +
                `Posts input text in emoji letters.\n` +
                `\n` +
                `${discord.getEmoji("star")}**say** text\n` +
                `Posts the input text.\n`
            )
        const helpUtil = embeds.createEmbed()
        helpUtil
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Utility Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**holiday**\n` +
                `Does not work yet.\n` +
                `\n` +
                `${discord.getEmoji("star")}**nasa**\n` +
                `Posts the astronomy picture of the day.\n` +
                `\n` +
                `${discord.getEmoji("star")}**photos**\n` +
                `Does not work yet.\n` +
                `\n` +
                `${discord.getEmoji("star")}**remdash**\n` +
                `Does not work yet.\n`
            )
        const helpMusic = embeds.createEmbed()
        helpMusic
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Music Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**play**\n` +
                `Does not work yet.\n`
            )
        const helpRole = embeds.createEmbed()
        helpRole
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Role Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**role add/del** _user/id_\n` +
                `Adds or removes a role from the specified user.\n`
            )
        const helpMod = embeds.createEmbed()
        helpMod
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Moderator Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**ban** user/id\n` +
                `Bans the specified user.\n` +
                `\n` +
                `${discord.getEmoji("star")}**del** number\n` +
                `Deletes an amount of messages (1-1000).\n` +
                `\n` +
                `${discord.getEmoji("star")}**kick** _user/id_\n` +
                `Kicks the specified user.\n` +
                `\n` +
                `${discord.getEmoji("star")}**unban** _user/id_\n` +
                `Unbans the specified user.\n`
            )
        const helpAdmin = embeds.createEmbed()
        helpAdmin
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Administrator Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**n/a**\n` +
                `N/A\n`
            )
        const helpLogging = embeds.createEmbed()
        helpLogging
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Logging Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**n/a**\n` +
                `N/A\n`
            )
        const helpConfig = embeds.createEmbed()
        helpConfig
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Configuration Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**n/a**\n` +
                `N/A\n`
            )
        const helpBotOwner = embeds.createEmbed()
        helpBotOwner
            .setAuthor("help", "https://cdn.discordapp.com/emojis/579856442551697418.gif")
            .setThumbnail(message.author!.displayAvatarURL())
            .setTitle(`Bot Developer Commands ${discord.getEmoji("gabTired")}`)
            .setDescription(
                `${discord.getEmoji("star")}**createguild** name region\n` +
                `Does not work yet.\n` +
                `\n` +
                `${discord.getEmoji("star")}**eval** code\n` +
                `Evaluates javascript code.\n` +
                `\n` +
                `${discord.getEmoji("star")}**reboot**\n` +
                `Does not work yet.\n` +
                `\n` +
                `${discord.getEmoji("star")}**reload** command\n` +
                `Reloads a command.\n` +
                `\n` +
                `${discord.getEmoji("star")}**set** status text\n` +
                `Set's the bots activity.\n`
            )

        embeds.createReactionEmbed([helpInfo, helpLevel, helpHeart, helpAnime, helpHentai, helpOsu, helpGeometry, helpJapanese,
        helpFun, helpWeb, helpUtil, helpMusic, helpRole, helpMod, helpAdmin, helpLogging, helpConfig, helpBotOwner])

    }
}

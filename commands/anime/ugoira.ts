import {Message, MessageAttachment} from "discord.js"
import fs from "fs"
import path from "path"
import PixivApiClient from "pixiv-app-api"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"
const download = require("image-downloader")

export default class UgoiraCommand extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Search for animated pixiv images (pixiv ugoira).",
            help:
            `
            _Note: Using the **pixiv** command on a ugoira link will run this command too!_
            \`ugoira\` - Gets a random pixiv ugoira.
            \`ugoira tag\` - Gets a pixiv ugoira from the tag (translated to japanese).
            \`ugoira en tag\` - Gets a pixiv ugoira from the tag (not translated).
            \`ugoira popular\` - Gets a random ugoira from the daily rankings.
            \`ugoira r18 tag\` - Gets an R-18 ugoira from the tag (translated to japanese).
            \`ugoira r18 en tag\` - Gets an R-18 ugoira from the tag (not translated).
            \`ugoira r18 popular\` - Gets a random ugoira from the R-18 daily rankings.
            `,
            examples:
            `
            \`=>ugoira\`
            \`=>ugoira r18 izumi sagiri\`
            \`=>ugoira r18 kisaragi (azur lane)\`
            \`=>ugoira popular\`
            `,
            aliases: ["u"],
            cooldown: 30,
            image: "../assets/help images/anime/ugoira.png"
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const star = discord.getEmoji("star")
        const images = new Images(discord, message)
        const embeds = new Embeds(discord, message)
        const pixivApi = new PixivApi(discord, message)
        const perms = new Permission(discord, message)
        const topDir = path.basename(__dirname).slice(0, -2) === "ts" ? "../" : ""
        const pixiv = new PixivApiClient()
        let input
        if (args[1].toLowerCase() === "r18" || args[1].toLowerCase() === "en") {
            if (args[2] === "en") {
                input = Functions.combineArgs(args, 3)
            } else {
                input = Functions.combineArgs(args, 2)
            }
        } else {
            input = Functions.combineArgs(args, 1)
        }
        const msg1 = await message.channel.send(`**Fetching Ugoira** ${discord.getEmoji("gabCircle")}`) as Message
        let pixivID
        if (input.match(/\d\d\d+/g)) {
            pixivID = input.match(/\d+/g)!.join("")
        } else {
            if (args[1].toLowerCase() === "r18") {
                if (!perms.checkNSFW()) return
                if (args[2].toLowerCase() === "en") {
                    const image = await pixivApi.getPixivImage(input, true, true, true, true)
                    try {
                        pixivID = image!.id
                    } catch {
                        return pixivApi.pixivErrorEmbed()
                    }
                } else {
                    const image = await pixivApi.getPixivImage(input, true, false, true, true)
                    try {
                        pixivID = image!.id
                    } catch {
                        return pixivApi.pixivErrorEmbed()
                    }
                }
            } else if (args[1].toLowerCase() === "en") {
                const image = await pixivApi.getPixivImage(input, false, true, true, true)
                try {
                    pixivID = image!.id
                } catch {
                    return pixivApi.pixivErrorEmbed()
                }
            } else {
                const image = await pixivApi.getPixivImage(input, false, false, true, true)
                try {
                    pixivID = image!.id
                } catch {
                    return pixivApi.pixivErrorEmbed()
                }
            }
        }

        await pixiv.login()
        const details = await pixiv.illustDetail(pixivID as number).then((i) => i.illust)
        const ugoiraInfo = await pixiv.ugoiraMetaData(pixivID as number)
        const fileNames: string[] = []
        const frameDelays: number[] = []
        const frameNames: string[] = []
        for (let i = 0; i < ugoiraInfo.ugoiraMetadata.frames.length; i++) {
            frameDelays.push(ugoiraInfo.ugoiraMetadata.frames[i].delay)
            fileNames.push(ugoiraInfo.ugoiraMetadata.frames[i].file)
        }
        for (let i = 0; i < fileNames.length; i++) {
            frameNames.push(fileNames[i].slice(0, -4))
        }

        await images.downloadZip(ugoiraInfo.ugoiraMetadata.zipUrls.medium, `${topDir}assets/ugoira/${pixivID}`)

        const file = fs.createWriteStream(`${topDir}ugoira/${pixivID}/${pixivID}.gif`)

        msg1.delete({timeout: 1000})
        const msg2 = await message.channel.send(`**Converting Ugoira to Gif. This might take awhile** ${discord.getEmoji("gabCircle")}`) as Message
        await images.encodeGif(fileNames, `${topDir}ugoira/${pixivID}/`, file)
        msg2.delete({timeout: 1000})

        const msg3 = await message.channel.send(`**Compressing Gif** ${discord.getEmoji("gabCircle")}`) as Message
        await images.compressGif([`${topDir}ugoira/${pixivID}/${pixivID}.gif`])
        msg3.delete({timeout: 1000})

        const ugoiraEmbed = embeds.createEmbed()
        const outGif = new MessageAttachment(`../assets/gifs/${pixivID}.gif`)
        const comments = await pixiv.illustComments(pixivID as number)
        const cleanText = details.caption.replace(/<\/?[^>]+(>|$)/g, "")
        const authorUrl = await download.image({url: details.user.profileImageUrls.medium, dest: `${topDir}assets/pixiv/illusts`, headers: {Referer: "http://www.pixiv.net/"}})
        const authorAttachment = new MessageAttachment(authorUrl.filename)
        const authorName = path.basename(authorAttachment.attachment as string)
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
                    if (!comments.comments[i]) break
                    commentArray.push(comments.comments[i].comment)
                }
        ugoiraEmbed
            .setTitle(`**Pixiv Ugoira** ${discord.getEmoji("chinoSmug")}`)
            .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixivID}`)
            .setDescription(
                `${star}_Title:_ **${details.title}**\n` +
                `${star}_Artist:_ **${details.user.name}**\n` +
                `${star}_Creation Date:_ **${Functions.formatDate(new Date(details.createDate))}**\n` +
                `${star}_Views:_ **${details.totalView}**\n` +
                `${star}_Bookmarks:_ **${details.totalBookmarks}**\n` +
                `${star}_Description:_ ${cleanText ? cleanText : "None"}\n` +
                `${star}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`
                )
            .attachFiles([outGif.attachment as string, authorAttachment])
            .setThumbnail(`attachment://${authorName}`)
            .setImage(`attachment://${pixivID}.gif`)
        message.channel.send(ugoiraEmbed)
    }
}

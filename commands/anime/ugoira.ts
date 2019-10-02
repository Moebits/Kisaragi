import {Message} from "discord.js"
import Ugoira from "node-ugoira"
import * as PixivApiClient from "pixiv-api-client"
import * as pixivImg from "pixiv-img"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {PixivApi} from "./../../structures/PixivApi"

export default class UgoiraCommand extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const images = new Images(discord, message)
        const embeds = new Embeds(discord, message)
        const pixivApi = new PixivApi(discord, message)
        const fs = require("fs")
        const pixiv = new PixivApiClient()
        const refreshToken = await pixivApi.pixivLogin()
        const input = (args[1].toLowerCase() === "r18" || args[1].toLowerCase() === "en") ?
        ((args[2] === "en") ? Functions.combineArgs(args, 3) : Functions.combineArgs(args, 2)) :
        Functions.combineArgs(args, 1)
        const msg1 = await message.channel.send(`**Fetching Ugoira** ${discord.getEmoji("gabCircle")}`) as Message
        let pixivID
        if (input.match(/\d+/g) !== null) {
            pixivID = input.match(/\d+/g)!.join("")
        } else {
            if (args[1].toLowerCase() === "r18") {
                if (args[2].toLowerCase() === "en") {
                    const image = await pixivApi.getPixivImage(refreshToken, input, true, true, true, true)
                    try {
                            pixivID = image.id
                        } catch (err) {
                            if (err) pixivApi.pixivErrorEmbed()
                        }
                } else {
                    const image = await pixivApi.getPixivImage(refreshToken, input, true, false, true, true)
                    try {
                            pixivID = image.id
                        } catch (err) {
                            if (err) pixivApi.pixivErrorEmbed()
                        }
                }
            } else if (args[1].toLowerCase() === "en") {
                const image = await pixivApi.getPixivImage(refreshToken, input, false, true, true, true)
                try {
                        pixivID = image.id
                    } catch (err) {
                        if (err) pixivApi.pixivErrorEmbed()
                    }
            } else {
                const image = await pixivApi.getPixivImage(refreshToken, input, false, false, true, true)
                try {
                        pixivID = image.id
                    } catch (err) {
                        if (err) pixivApi.pixivErrorEmbed()
                    }
            }
        }

        await pixiv.refreshAccessToken(refreshToken)
        const details = await pixiv.illustDetail(pixivID)
        const ugoiraInfo = await pixiv.ugoiraMetaData(pixivID)
        const fileNames: string[] = []
        const frameDelays: string[] = []
        const frameNames: string[] = []
        for (const i in ugoiraInfo.ugoira_metadata.frames) {
            frameDelays.push(ugoiraInfo.ugoira_metadata.frames[i].delay)
            fileNames.push(ugoiraInfo.ugoira_metadata.frames[i].file)
        }
        for (let i = 0; i < fileNames.length; i++) {
            frameNames.push(fileNames[i].slice(0, -4))
        }

        const ugoira = new Ugoira(pixivID)
        await ugoira.initUgoira(refreshToken)

        const file = fs.createWriteStream(`ugoira/${pixivID}/${pixivID}.gif`, (err) => console.log(err))

        msg1.delete({timeout: 1000})
        const msg2 = await message.channel.send(`**Converting Ugoira to Gif. This might take awhile** ${discord.getEmoji("gabCircle")}`) as Message
        await images.encodeGif(fileNames, `ugoira/${pixivID}/`, file)
        msg2.delete({timeout: 1000})

        const msg3 = await message.channel.send(`**Compressing Gif** ${discord.getEmoji("gabCircle")}`) as Message
        await images.compressGif([`ugoira/${pixivID}/${pixivID}.gif`])
        msg3.delete({timeout: 1000})

        const ugoiraEmbed = embeds.createEmbed()
        const {Attachment} = require("discord.js")
        const outGif = new Attachment(`../assets/gifs/${pixivID}.gif`)
        const comments = await pixiv.illustComments(pixivID)
        const cleanText = details.illust.caption.replace(/<\/?[^>]+(>|$)/g, "")
        const authorUrl = await pixivImg(details.illust.user.profile_image_urls.medium)
        const authorAttachment = new Attachment(authorUrl)
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
                    if (!comments.comments[i]) break
                    commentArray.push(comments.comments[i].comment)
                }
        ugoiraEmbed
            .setTitle(`**Pixiv Ugoira** ${discord.getEmoji("kannaSip")}`)
            .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixivID}`)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${details.illust.title}**\n` +
                `${discord.getEmoji("star")}_Artist:_ **${details.illust.user.name}**\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(details.illust.create_date)}**\n` +
                `${discord.getEmoji("star")}_Views:_ **${details.illust.total_view}**\n` +
                `${discord.getEmoji("star")}_Bookmarks:_ **${details.illust.total_bookmarks}**\n` +
                `${discord.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` +
                `${discord.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`
                )
            .attachFiles([outGif.file, authorAttachment])
            .setThumbnail(`attachment://${authorAttachment.file}`)
            .setImage(`attachment://${pixivID}.gif`)
        message.channel.send(ugoiraEmbed)
    }
}

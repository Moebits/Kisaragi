import {Message, MessageAttachment} from "discord.js"
import path from "path"
import PixivApiClient, {PixivIllust} from "pixiv-app-api"
import {CommandFunctions} from "./CommandFunctions"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {Permission} from "./Permission"

const translate = require("@vitalets/google-translate-api")
const download = require("image-downloader")

const pixiv = new PixivApiClient(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD)

export class PixivApi {
    private readonly embeds = new Embeds(this.discord, this.message)
    private readonly cmd = new CommandFunctions(this.discord, this.message)
    private readonly perms = new Permission(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Create Pixiv Embed
    public createPixivEmbed = async (image: PixivIllust) => {
        if (image.xRestrict !== 0) {
            if (!this.perms.checkNSFW()) return
        }
        const star = this.discord.getEmoji("star")
        const pixivEmbed = this.embeds.createEmbed()
        if (!image) return this.pixivErrorEmbed
        const comments = await pixiv.illustComments(image.id)
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
                if (!comments.comments[i]) break
                commentArray.push(comments.comments[i].comment)
            }
        const topDir = path.basename(__dirname).slice(0, -2) === "ts" ? "../" : ""
        const url = await download.image({url: image.imageUrls.medium, dest: `${topDir}assets/pixiv/illusts`, headers: {Referer: "http://www.pixiv.net/"}})
        const authorUrl = await download.image({url: image.user.profileImageUrls.medium, dest: `${topDir}assets/pixiv/profiles`, headers: {Referer: "http://www.pixiv.net/"}})
        const imageAttachment = new MessageAttachment(url.filename)
        const authorAttachment = new MessageAttachment(authorUrl.filename)
        const imageName = path.basename(imageAttachment.attachment as string)
        const authorName = path.basename(authorAttachment.attachment as string)
        const cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "")
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .setDescription(
        `${star}_Title:_ **${image.title}**\n` +
        `${star}_Artist:_ **${image.user.name}**\n` +
        `${star}_Creation Date:_ **${Functions.formatDate(new Date(image.createDate))}**\n` +
        `${star}_Views:_ **${image.totalView}**\n` +
        `${star}_Bookmarks:_ **${image.totalBookmarks}**\n` +
        `${star}_Description:_ ${cleanText ? cleanText : "None"}\n` +
        `${star}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`
        )
        .attachFiles([authorAttachment, imageAttachment])
        .setThumbnail(`attachment://${authorName}`)
        .setImage(`attachment://${imageName}`)
        return pixivEmbed
    }

    // Pixiv Error Embed
    public pixivErrorEmbed = () => {
        const pixivEmbed = this.embeds.createEmbed()
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
        .setDescription("No results were found. You can turn off the bookmark filter by adding **all**. Also, try searching for the japanese tag on the " +
        "[**Pixiv Website**](https://www.pixiv.net/), as some tags can't be translated to english.")
        return this.message.reply({embed: pixivEmbed})
    }

    // Process Pixiv Tag
    public pixivTag = async (tag: string) => {
        const replaceString = tag
        .replace(/gabriel dropout/i, "ガヴリールドロップアウト")
        .replace(/tenma gabriel white|gabriel white|gabriel/i, "天真=ガヴリール=ホワイト")
        .replace(/vignette tsukinose april|vignette tsukinose|vignette/i, "月乃瀬=ヴィネット=エイプリル")
        .replace(/satanichia kurumizawa mcDowell|satania/i, "胡桃沢=サタニキア=マクドウェル")
        .replace(/chisaki tapris sugarbell|tapris/i, "千咲=タプリス=シュガーベル")
        .replace(/shiraha raphiel ainsworth|raphiel|raphi/i, "白羽=ラフィエル=エインズワース")
        .replace(/kisaragi/i, "如月(アズールレーン)")
        .replace(/sagiri izumi|sagiri/i, "和泉紗霧")
        .replace(/eromanga sensei/i, "エロマンガ先生")
        .replace(/black tights/i, "黒タイツ")
        .replace(/white tights/i, "白タイツ")
        .replace(/konosuba/i, "この素晴らしい世界に祝福を!")
        .replace(/megumin/i, "めぐみん")
        .replace(/aqua/i, "アクア(このすば)")
        .replace(/kiniro mosaic/i, "きんいろモザイク")
        .replace(/karen kujo|karen/i, "九条カレン")
        .replace(/chino kafuu|chino/i, "香風智乃")
        .replace(/is the order a rabbit[\s\S]*/i, "ご注文はうさぎですか?")
        .replace(/tohru/i, "トール(小林さんちのメイドラゴン)")
        .replace(/kanna kamui|kanna/i, "カンナカムイ")
        .replace(/miss kobayashi[\s\S]*dragon maid|dragon maid/i, "小林さんちのメイドラゴン")
        .replace(/kancolle/i, "艦これ")
        .replace(/azur lane/i, "アズールレーン")
        .replace(/laffey/i, "ラフィー(アズールレーン)")
        .replace(/senko[\s\S]*san|senko/i, "仙狐さん")
        if (replaceString !== tag) return replaceString
        const newTag = await translate(tag, {to: "ja"})
        return newTag.text.trim()
    }

    // Pixiv Image
    public getPixivImage = async (tag: string, r18?: boolean, en?: boolean, ugoira?: boolean, noEmbed?: boolean) => {
        tag = tag.match(/all/gi) ? tag : tag += "00"
        const newTag = en ? tag.trim() : await this.pixivTag(tag.trim())
        await pixiv.login()
        let json
        if (r18) {
            if (ugoira) {
                json = await pixiv.searchIllust(`うごイラ R-18 ${newTag}`)
            } else {
                json = await pixiv.searchIllust(`R-18 ${newTag}`)
            }
        } else {
            if (ugoira) {
                json = await pixiv.searchIllust(`うごイラ ${newTag} -R-18`)
            } else {
                json = await pixiv.searchIllust(`${newTag} -R-18`)
            }
        }
        [].sort.call(json.illusts, ((a: PixivIllust, b: PixivIllust) => (a.totalBookmarks - b.totalBookmarks) * -1))
        const index = Math.floor(Math.random() * (json.illusts.length - json.illusts.length/2) + json.illusts.length/2)
        const image = json.illusts[index]
        if (!image) return this.pixivErrorEmbed()
        if (noEmbed) return image

        const pixivEmbed = await this.createPixivEmbed(image)
        if (!pixivEmbed) return
        return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Image ID
    public getPixivImageID = async (tags: string) => {
        await pixiv.login()
        let image: PixivIllust
        try {
            image = await pixiv.illustDetail(Number(tags)).then((i) => i.illust)
        } catch {
            return this.pixivErrorEmbed()
        }
        if (image.type === "ugoira") {
            await this.cmd.runCommand(this.message, ["ugoira", tags])
            return
        }
        const pixivEmbed = await this.createPixivEmbed(image)
        if (!pixivEmbed) return
        return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Popular Image
    public getPopularPixivImage = async () => {
        const mode = "day_male"
        await pixiv.login()
        const json = await pixiv.illustRanking({mode});
        [].sort.call(json.illusts, ((a: PixivIllust, b: PixivIllust) => (a.totalBookmarks - b.totalBookmarks)*-1))
        const index = Math.floor(Math.random() * (json.illusts.length - json.illusts.length/2) + json.illusts.length/2)
        const image = json.illusts[index]

        const pixivEmbed = await this.createPixivEmbed(image)
        if (!pixivEmbed) return
        return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Popular R18 Image
    public getPopularPixivR18Image = async () => {
        const mode = "day_male_r18"
        await pixiv.login()
        const json = await pixiv.illustRanking({mode});
        [].sort.call(json.illusts, ((a: PixivIllust, b: PixivIllust) => (a.totalBookmarks - b.totalBookmarks) * -1))
        const index = Math.floor(Math.random() * (json.illusts.length - json.illusts.length/2) + json.illusts.length/2)
        const image = json.illusts[index]

        const pixivEmbed = await this.createPixivEmbed(image)
        if (!pixivEmbed) return
        return this.message.channel.send(pixivEmbed)
    }
}

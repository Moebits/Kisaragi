import {Message, MessageAttachment, MessageEmbed} from "discord.js"
import path from "path"
import Pixiv, {PixivIllust} from "pixiv.ts"
import {CommandFunctions} from "./CommandFunctions"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {Permission} from "./Permission"
const imgur = require("imgur")

export class PixivApi {
    private readonly embeds = new Embeds(this.discord, this.message)
    private readonly cmd = new CommandFunctions(this.discord, this.message)
    private readonly perms = new Permission(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Create Pixiv Embed
    public createPixivEmbed = async (image: PixivIllust, noImgur?: boolean) => {
        const discord = this.discord
        const pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        if (image.x_restrict !== 0) {
            if (!this.perms.checkNSFW()) return
        }
        await imgur.setClientId(process.env.IMGUR_discord_ID)
        await imgur.setAPIUrl("https://api.imgur.com/3/")
        const pixivEmbed = this.embeds.createEmbed()
        if (!image) return
        const comments = await pixiv.illust.comments({illust_id: image.id})
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
                if (!comments.comments[i]) break
                commentArray.push(comments.comments[i].comment)
            }
        const topDir = path.basename(__dirname).slice(0, -2) === "ts" ? "../" : ""
        const url = await pixiv.util.downloadIllust(image, `${topDir}assets/pixiv/illusts`)
        const authorUrl = await pixiv.util.downloadProfilePicture(image, `${topDir}assets/pixiv/profiles`)
        if (noImgur) {
            pixivEmbed
            const imageAttachment = new MessageAttachment(url, "image.png")
            const authorAttachment = new MessageAttachment(authorUrl, "author.png")
            pixivEmbed
            .attachFiles([authorAttachment, imageAttachment])
            .setThumbnail(`attachment://author.png`)
            .setImage(`attachment://image.png`)
        } else {
            const illustImage = await imgur.uploadFile(url).then((j: any) => j.data.link)
            const authorImage = await imgur.uploadFile(authorUrl).then((j: any) => j.data.link)
            pixivEmbed
            .setThumbnail(authorImage)
            .setImage(illustImage)
        }
        const cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "")
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
        .setDescription(
        `${discord.getEmoji("star")}_Title:_ **${image.title}**\n` +
        `${discord.getEmoji("star")}_Artist:_ **${image.user.name}**\n` +
        `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(image.create_date))}**\n` +
        `${discord.getEmoji("star")}_Views:_ **${image.total_view}**\n` +
        `${discord.getEmoji("star")}_Bookmarks:_ **${image.total_bookmarks}**\n` +
        `${discord.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` +
        `${discord.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`
        )
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

    // Pixiv Image
    public getPixivImage = async (tag: string, r18?: boolean, en?: boolean, ugoira?: boolean, noEmbed?: boolean) => {
        tag = tag.match(/all/gi) ? tag : tag += " 00"
        const pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        let json
        if (r18) {
            if (ugoira) {
                if (en) {
                    json = await pixiv.search.illusts({word: `うごイラ ${tag}`, en: true, r18: true, type: "ugoira"})
                } else {
                    json = await pixiv.search.illusts({word: `うごイラ ${tag}`, r18: true, type: "ugoira"})
                }
            } else {
                if (en) {
                    json = await pixiv.search.illusts({word: tag, en: true, r18: true})
                } else {
                    json = await pixiv.search.illusts({word: tag, r18: true})
                }
            }
        } else {
            if (ugoira) {
                if (en) {
                    json = await pixiv.search.illusts({word: `うごイラ ${tag}`, en: true, r18: false, type: "ugoira"})
                } else {
                    json = await pixiv.search.illusts({word: `うごイラ ${tag}`, r18: false, type: "ugoira"})
                }
            } else {
                if (en) {
                    json = await pixiv.search.illusts({word: tag, en: true, r18: false})
                } else {
                    json = await pixiv.search.illusts({word: tag, r18: false})
                }
            }
        }
        const illusts = pixiv.util.sort(json.illusts)
        if (!illusts[0]) return this.pixivErrorEmbed()
        if (noEmbed) {
            const index = Math.floor(Math.random() * (illusts.length - illusts.length/2) + illusts.length/2)
            const image = illusts[index]
            if (!image) return this.pixivErrorEmbed()
            return image
        }

        const pixivArray: MessageEmbed[] = []
        const max = illusts.length > 10 ? 10 : illusts.length
        for (let i = 0; i < max; i++) {
            let pixivEmbed: MessageEmbed | undefined
            try {
                pixivEmbed = await this.createPixivEmbed(illusts[i])
                if (!pixivEmbed) continue
                pixivArray.push(pixivEmbed)
            } catch {
                pixivEmbed = await this.createPixivEmbed(illusts[i], true)
                if (!pixivEmbed) break
                pixivArray.push(pixivEmbed)
                break
            }
        }

        if (!pixivArray[0]) return this.pixivErrorEmbed()
        if (pixivArray.length === 1) {
            this.message.channel.send(pixivArray[0])
        } else {
            this.embeds.createReactionEmbed(pixivArray, true)
        }
        return
    }

    // Pixiv Image ID
    public getPixivImageID = async (tags: string) => {
        const pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        let image: PixivIllust
        try {
            image = await pixiv.illust.detail({illust_id: Number(tags)}).then((i) => i.illust)
        } catch {
            return this.pixivErrorEmbed()
        }
        if (image.type === "ugoira") {
            await this.cmd.runCommand(this.message, ["ugoira", tags])
            return
        }
        const pixivEmbed = await this.createPixivEmbed(image)
        if (!pixivEmbed) return this.pixivErrorEmbed()
        return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Popular Image
    public getPopularPixivImage = async () => {
        const mode = "day_male"
        const pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        const json = await pixiv.illust.ranking({mode})
        const illusts = pixiv.util.sort(json.illusts)
        if (!illusts[0]) return this.pixivErrorEmbed()
        const pixivArray: MessageEmbed[] = []
        const max = illusts.length > 10 ? 10 : illusts.length
        for (let i = 0; i < max; i++) {
            let pixivEmbed: MessageEmbed | undefined
            try {
                pixivEmbed = await this.createPixivEmbed(illusts[i])
                if (!pixivEmbed) continue
                pixivArray.push(pixivEmbed)
            } catch {
                pixivEmbed = await this.createPixivEmbed(illusts[i], true)
                if (!pixivEmbed) break
                pixivArray.push(pixivEmbed)
                break
            }
        }

        if (!pixivArray[0]) return this.pixivErrorEmbed()
        if (pixivArray.length === 1) {
            this.message.channel.send(pixivArray[0])
        } else {
            this.embeds.createReactionEmbed(pixivArray, true)
        }
        return
    }

    // Pixiv Popular R18 Image
    public getPopularPixivR18Image = async () => {
        const mode = "day_male_r18"
        const pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        const json = await pixiv.illust.ranking({mode})
        const illusts = pixiv.util.sort(json.illusts)
        if (!illusts[0]) return this.pixivErrorEmbed()
        const pixivArray: MessageEmbed[] = []
        const max = illusts.length > 10 ? 10 : illusts.length
        for (let i = 0; i < max; i++) {
            let pixivEmbed: MessageEmbed | undefined
            try {
                pixivEmbed = await this.createPixivEmbed(illusts[i])
                if (!pixivEmbed) continue
                pixivArray.push(pixivEmbed)
            } catch {
                pixivEmbed = await this.createPixivEmbed(illusts[i], true)
                if (!pixivEmbed) break
                pixivArray.push(pixivEmbed)
                break
            }
        }

        if (!pixivArray[0]) return this.pixivErrorEmbed()
        if (pixivArray.length === 1) {
            this.message.channel.send(pixivArray[0])
        } else {
            this.embeds.createReactionEmbed(pixivArray, true)
        }
        return
    }
}

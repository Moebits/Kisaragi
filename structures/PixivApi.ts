import {Message, MessageAttachment, MessageEmbed} from "discord.js"
import path from "path"
import Pixiv, {PixivFolderMap, PixivIllust} from "pixiv.ts"
import {CommandFunctions} from "./CommandFunctions"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Images} from "./Images"
import {Kisaragi} from "./Kisaragi"
import {Permission} from "./Permission"

export class PixivApi {
    private readonly images = new Images(this.discord, this.message)
    private readonly embeds = new Embeds(this.discord, this.message)
    private readonly cmd = new CommandFunctions(this.discord, this.message)
    private readonly perms = new Permission(this.discord, this.message)
    private pixiv: Pixiv | null = null
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Create Pixiv Embed
    public createPixivEmbed = async (image: PixivIllust, noUpload?: boolean) => {
        const discord = this.discord
        if (!this.pixiv) this.pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        if (image.x_restrict !== 0) {
            if (!this.perms.checkNSFW(true)) return
        }
        const pixivEmbed = this.embeds.createEmbed()
        if (!image) return
        const comments = await this.pixiv.illust.comments({illust_id: image.id})
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
                if (!comments.comments[i]) break
                commentArray.push(comments.comments[i].comment)
        }
        // const viewLink = await this.pixiv.util.viewLink(String(image.id))
        const url = await this.pixiv.util.downloadIllust(image, `assets/images/pixiv/illusts`)
        const authorUrl = await this.pixiv.util.downloadProfilePicture(image, `assets/images/pixiv/profiles`)
        // const viewLinkAppend = viewLink ? `_Image not showing? Click_ [**here**](${viewLink}).` : ""
        if (noUpload) {
            pixivEmbed
            const imageAttachment = new MessageAttachment(url, "image.png")
            const authorAttachment = new MessageAttachment(authorUrl, "author.png")
            pixivEmbed
            .attachFiles([authorAttachment, imageAttachment])
            .setThumbnail(`attachment://author.png`)
            .setImage(`attachment://image.png`)
        } else {
            const illustImage = await this.images.upload(url)
            const authorImage = await this.images.upload(authorUrl)
            pixivEmbed
            .setImage(encodeURI(illustImage))
            .setThumbnail(encodeURI(authorImage))
        }
        const cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "")
        pixivEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814", "https://www.pixiv.net/en/")
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
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814", "https://www.pixiv.net/en/")
        .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
        .setDescription("No results were found. You can turn off the bookmark filter by adding **all**. Also, try searching for the japanese tag on the " +
        "[**Pixiv Website**](https://www.pixiv.net/), as some tags can't be translated to english.")
        return this.message.reply({embed: pixivEmbed})
    }

    // Pixiv Image
    public getPixivImage = async (tag?: string, r18?: boolean, en?: boolean, ugoira?: boolean, noEmbed?: boolean) => {
        const msg1 = await this.message.channel.send(`**Searching Pixiv...** ${this.discord.getEmoji("gabCircle")}`)
        if (!this.pixiv) this.pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        let setFast = false
        if (tag && /fast/.test(tag)) {
            tag = tag.replace("fast", "").trim()
            setFast = true
        }
        let json: PixivIllust[]
        if (r18) {
            if (ugoira) {
                if (en) {
                    json = await this.pixiv.search.illusts({word: `うごイラ ${tag}`, en: true, r18: true, type: "ugoira", moe: true})
                } else {
                    json = await this.pixiv.search.illusts({word: `うごイラ ${tag}`, r18: true, type: "ugoira", moe: true})
                }
            } else {
                if (en) {
                    json = await this.pixiv.search.illusts({word: tag, en: true, r18: true, moe: true})
                } else {
                    json = await this.pixiv.search.illusts({word: tag, r18: true, moe: true})
                }
            }
        } else {
            if (ugoira) {
                if (en) {
                    json = await this.pixiv.search.illusts({word: `うごイラ ${tag}`, en: true, r18: false, type: "ugoira", moe: true})
                } else {
                    json = await this.pixiv.search.illusts({word: `うごイラ ${tag}`, r18: false, type: "ugoira", moe: true})
                }
            } else {
                if (en) {
                    json = await this.pixiv.search.illusts({word: tag, en: true, r18: false, moe: true})
                } else {
                    json = await this.pixiv.search.illusts({word: tag, r18: false, moe: true})
                }
            }
        }
        if (msg1) msg1.delete()
        const illusts = json
        if (!illusts[0]) return this.pixivErrorEmbed()
        if (noEmbed) {
            const index = Math.floor(Math.random() * (illusts.length - illusts.length/2) + illusts.length/2)
            const image = illusts[index]
            if (!image) return this.pixivErrorEmbed()
            return image
        }
        const msg2 = await this.message.channel.send(`**Uploading pictures...** ${this.discord.getEmoji("gabCircle")}`)
        const pixivArray: MessageEmbed[] = []
        const max = illusts.length > 5 ? 5 : illusts.length
        for (let i = 0; i < max; i++) {
            let pixivEmbed: MessageEmbed | undefined
            if (setFast) {
                pixivEmbed = await this.createPixivEmbed(illusts[i], true)
                if (!pixivEmbed) break
                pixivArray.push(pixivEmbed)
                break
            }
            if (msg2) msg2.edit(`**Uploading pictures... (${i+1})** ${this.discord.getEmoji("gabCircle")}\n_Want a faster command? Add the tag_ \`fast\` _somewhere._`)
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

        msg2.delete()
        if (!pixivArray[0]) return this.pixivErrorEmbed()
        if (pixivArray.length === 1) {
            this.message.channel.send(pixivArray[0])
        } else {
            this.embeds.createReactionEmbed(pixivArray, true, true)
        }
        return
    }

    // Pixiv Image ID
    public getPixivImageID = async (tags: string) => {
        if (!this.pixiv) this.pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        let image: PixivIllust
        try {
            image = await this.pixiv.illust.detail({illust_id: Number(tags)})
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
        const msg1 = await this.message.channel.send(`**Searching Pixiv...** ${this.discord.getEmoji("gabCircle")}`)
        const mode = "day_male"
        if (!this.pixiv) this.pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        const json = await this.pixiv.illust.ranking({mode})
        const illusts = this.pixiv.util.sort(json)
        if (msg1) msg1.delete()
        if (!illusts[0]) return this.pixivErrorEmbed()
        const msg2 = await this.message.channel.send(`**Uploading pictures...** ${this.discord.getEmoji("gabCircle")}`)
        const pixivArray: MessageEmbed[] = []
        const max = illusts.length > 5 ? 5 : illusts.length
        for (let i = 0; i < max; i++) {
            if (msg2) msg2.edit(`**Uploading pictures... (${i+1})** ${this.discord.getEmoji("gabCircle")}\n_Want a faster command? Add the tag_ \`fast\` _somewhere._`)
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
        if (msg2) msg2.delete()
        if (!pixivArray[0]) return this.pixivErrorEmbed()
        if (pixivArray.length === 1) {
            this.message.channel.send(pixivArray[0])
        } else {
            this.embeds.createReactionEmbed(pixivArray, true, true)
        }
        return
    }

    // Pixiv Popular R18 Image
    public getPopularPixivR18Image = async () => {
        const msg1 = await this.message.channel.send(`**Searching Pixiv...** ${this.discord.getEmoji("gabCircle")}`)
        const mode = "day_male_r18"
        if (!this.pixiv) this.pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        const json = await this.pixiv.illust.ranking({mode})
        const illusts = this.pixiv.util.sort(json)
        if (msg1) msg1.delete()
        if (!illusts[0]) return this.pixivErrorEmbed()
        const msg2 = await this.message.channel.send(`**Uploading pictures...** ${this.discord.getEmoji("gabCircle")}`)
        const pixivArray: MessageEmbed[] = []
        const max = illusts.length > 5 ? 5 : illusts.length
        for (let i = 0; i < max; i++) {
            if (msg2) msg2.edit(`**Uploading pictures... (${i+1})** ${this.discord.getEmoji("gabCircle")}\n_Want a faster command? Add the tag_ \`fast\` _somewhere._`)
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
        if (msg2) msg2.delete()
        if (!pixivArray[0]) return this.pixivErrorEmbed()
        if (pixivArray.length === 1) {
            this.message.channel.send(pixivArray[0])
        } else {
            this.embeds.createReactionEmbed(pixivArray, true, true)
        }
        return
    }

    // Download pixiv images
    public downloadPixivImages = async (tag: string, r18?: boolean, folderMap?: PixivFolderMap[]) => {
        const embeds = new Embeds(this.discord, this.message)
        if (!this.pixiv) this.pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        const msg1 = await this.message.channel.send(`**Downloading the pictures, please wait...** ${this.discord.getEmoji("gabCircle")}`)
        if (r18) tag += " R-18"
        tag = tag.trim()
        const rand = Math.floor(Math.random()*10000)
        const src = `assets/images/pixiv/zip/${rand}/`
        let files: string[] = []
        try {
            files = await this.pixiv.util.downloadIllusts(tag, src, undefined, folderMap) as any
        } catch {
            return this.pixivErrorEmbed()
        }
        if (msg1) msg1.delete()
        if (!files?.[0]) return this.pixivErrorEmbed()
        const msg2 = await this.message.channel.send(`**Creating a zip file...** ${this.discord.getEmoji("gabCircle")}`)
        const name = tag.trim() ? tag.replace(/ +/g, "-") : "pixiv_dl_default"
        const dir = path.join(__dirname, `../../assets/images/pixiv/zip/${rand}/`)
        const dest = path.join(__dirname, `../../assets/images/pixiv/zip/${name}.zip`)
        await Functions.zipDir(dir, dest)
        const attachment = new MessageAttachment(dest, `${name}.zip`)
        const images = await Promise.all(files.map((f) => this.pixiv!.util.viewLink(path.basename(f).match(/\d{4,}/)?.[0] ?? ""))).then((r) => r.filter(Boolean))
        const downloadArray: MessageEmbed[] = []
        // let att = false
        // if (images.length < 1) images.length = 1; att = true
        for (let i = 0; i < images.length; i++) {
            const downloadEmbed = embeds.createEmbed()
            .setImage(images[i])
            .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814", "https://www.pixiv.net/en/")
            .setTitle(`**Pixiv Download** ${this.discord.getEmoji("chinoSmug")}`)
            .setDescription(`${this.discord.getEmoji("star")}Downloaded **${files.length}** images for the tag **${tag ? tag : "default"}**! Not every image has a viewable direct link.`)
            /*if (att) {
                downloadEmbed
                .attachFiles([files[0]])
                .setImage(`attachment://${path.basename(files[0])}`)
            }*/
            downloadArray.push(downloadEmbed)
        }
        if (msg2) msg2.delete()
        if (downloadArray.length === 1) {
            await this.message.channel.send(downloadArray[0])
        } else {
            await this.embeds.createReactionEmbed(downloadArray)
        }
        await this.message.channel.send(attachment)
        Functions.removeDirectory(src)
        return
    }
}

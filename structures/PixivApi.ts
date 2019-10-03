import {Message, MessageAttachment} from "discord.js"
import {Embeds} from "./Embeds"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi"
import {Link} from "./Link"

const translate = require("@vitalets/google-translate-api")
const pixivApi = require("pixiv-api-client")
const pixivImg = require("pixiv-img")

const pixiv = new pixivApi()

export class PixivApi {
    private readonly embeds = new Embeds(this.discord, this.message)
    private readonly links = new Link(this.discord)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Pixiv Login
    public pixivLogin = async () => {
    try {
        await pixiv.refreshAccessToken(process.env.PIXIV_REFRESH_TOKEN)
    } catch (err) {
        await pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD, true)
        const refresh = await pixiv.refreshAccessToken()
        console.log("Refresh token expired. New one:")
        console.log(refresh.refresh_token)
    }
    const token = await pixiv.refreshAccessToken()
    return token.refresh_token
    }

    // Create Pixiv Embed
    public createPixivEmbed = async (refreshToken: string, image: any) => {
    await pixiv.refreshAccessToken(refreshToken)
    const pixivEmbed = this.embeds.createEmbed()
    if (!image) this.pixivErrorEmbed
    const comments = await pixiv.illustComments(image.id)
    const commentArray: string[] = []
    for (let i = 0; i <= 5; i++) {
            if (!comments.comments[i]) break
            commentArray.push(comments.comments[i].comment)
        }
    const url = await pixivImg(image.image_urls.medium)
    const authorUrl = await pixivImg(image.user.profile_image_urls.medium)
    const imageAttachment = new MessageAttachment(url)
    const authorAttachment = new MessageAttachment(authorUrl)
    const cleanText = image.caption.replace(/<\/?[^>]+(>|$)/g, "")
    pixivEmbed
    .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
    .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
    .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${image.id}`)
    .setDescription(
    `${this.discord.getEmoji("star")}_Title:_ **${image.title}**\n` +
    `${this.discord.getEmoji("star")}_Artist:_ **${image.user.name}**\n` +
    `${this.discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(image.create_date)}**\n` +
    `${this.discord.getEmoji("star")}_Views:_ **${image.total_view}**\n` +
    `${this.discord.getEmoji("star")}_Bookmarks:_ **${image.total_bookmarks}**\n` +
    `${this.discord.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` +
    `${this.discord.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`
    )
    .attachFiles([authorAttachment, imageAttachment])
    .setThumbnail(`attachment://${authorAttachment.name}`)
    .setImage(`attachment://${imageAttachment.name}`)
    return pixivEmbed
    }

    // Pixiv Error Embed
    public pixivErrorEmbed = () => {
        const pixivEmbed = this.embeds.createEmbed()
        pixivEmbed
        .setTitle(`**Pixiv Image** ${this.discord.getEmoji("chinoSmug")}`)
        .setDescription("No results were found. Try searching for the japanese tag on the Pixiv website, " +
        "as some tags can't be translated to english!" + "\n[Pixiv Website](https://www.pixiv.net/)")
        return this.message.channel.send(pixivEmbed)
    }
    // Process Pixiv Tag
    public pixivTag = async (tag: string) => {
        const newTag = await translate(tag, {to: "ja"})
        return newTag.text
    }

    // Pixiv Image
    public getPixivImage = async (refresh: string, tag: string, r18?: boolean, en?: boolean, ugoira?: boolean, noEmbed?: boolean) => {
    const refreshToken = refresh
    await pixiv.refreshAccessToken(refreshToken)
    let newTag = en ? tag : await this.pixivTag(tag)
    newTag = newTag.trim()
    await pixiv.login(process.env.PIXIV_NAME, process.env.PIXIV_PASSWORD)
    const json = r18 ? (ugoira ? await pixiv.searchIllust(`うごイラ R-18 ${newTag}`) : await pixiv.searchIllust(`R-18 ${newTag}`)) :
    (ugoira ? await pixiv.searchIllust(`うごイラ ${newTag} -R-18`) : await pixiv.searchIllust(`${newTag} -R-18`));
    [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1))
    const index = Math.floor(Math.random() * (10))
    const image = json.illusts[index]
    if (noEmbed) return image

    const pixivEmbed = await this.createPixivEmbed(refreshToken, image)
    return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Image ID
    public getPixivImageID = async (refresh: string, tags: any) => {
    const refreshToken = refresh
    await pixiv.refreshAccessToken(refreshToken)
    const image = await pixiv.illustDetail(tags.toString())
    for (const i in image.illust.tags) {
        if (image.illust.tags[i].name === "うごイラ") {
            const path = require("../commands/anime/ugoira.js")
            await this.links.linkRun(path, this.message, ["ugoira", tags.toString()])
            return
        }
    }
    if (!image) this.pixivErrorEmbed
    const pixivEmbed = await this.createPixivEmbed(refreshToken, image.illust)
    return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Random Image
    public getRandomPixivImage = async (refresh: string) => {
    const refreshToken = refresh
    await pixiv.refreshAccessToken(refreshToken)
    let image
    let random = 0
    while (!image) {
        random = Math.floor(Math.random() * 100000000)
        image = await pixiv.illustDetail(random.toString())
    }
    const pixivEmbed = await this.createPixivEmbed(refreshToken, image.illust)
    return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Popular Image
    public getPopularPixivImage = async (refresh: string) => {
    const refreshToken = refresh
    await pixiv.refreshAccessToken(refreshToken)
    const json = await pixiv.illustRanking();
    [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1))
    const index = Math.floor(Math.random() * (10))
    const image = json.illusts[index]

    const pixivEmbed = await this.createPixivEmbed(refreshToken, image)
    return this.message.channel.send(pixivEmbed)
    }

    // Pixiv Popular R18 Image
    public getPopularPixivR18Image = async (refresh: string) => {
    const refreshToken = refresh
    await pixiv.refreshAccessToken(refreshToken)
    const json = await pixiv.illustRanking({mode: "day_male_r18"});
    [].sort.call(json.illusts, ((a: any, b: any) => (a.total_bookmarks - b.total_bookmarks)*-1))
    const index = Math.floor(Math.random() * (10))
    const image = json.illusts[index]

    const pixivEmbed = await this.createPixivEmbed(refreshToken, image)
    return this.message.channel.send(pixivEmbed)
    }
}

import {Message, MessageAttachment, MessageReaction, User} from "discord.js"
import path from "path"
import Pixiv, {PixivIllust, UgoiraMetaData} from "pixiv.ts"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"

export default class Ugoira extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for animated pixiv images (pixiv ugoira).",
            help:
            `
            _Note: Using the **pixiv** command on a ugoira link will run this command too!_
            \`ugoira\` - Gets a pixiv ugoira with some defaults.
            \`ugoira link/id\` - Gets the pixiv ugoira from the link.
            \`ugoira tag\` - Gets a pixiv ugoira from the tag (translated to japanese).
            \`ugoira en tag\` - Gets a pixiv ugoira from the tag (not translated).
            \`ugoira r18 tag\` - Gets an R-18 ugoira from the tag (translated to japanese).
            \`ugoira r18 en tag\` - Gets an R-18 ugoira from the tag (not translated).
            `,
            examples:
            `
            \`=>ugoira\`
            \`=>ugoira izumi sagiri\`
            \`=>ugoira kisaragi (azur lane)\`
            `,
            aliases: ["u"],
            random: "none",
            cooldown: 30,
            nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const images = new Images(discord, message)
        const embeds = new Embeds(discord, message)
        const pixivApi = new PixivApi(discord, message)
        const perms = new Permission(discord, message)
        const pixiv = await Pixiv.login(process.env.PIXIV_NAME!, process.env.PIXIV_PASSWORD!)
        let input: string
        if (args[1] && (args[1].toLowerCase() === "r18" || args[1].toLowerCase() === "en" || args[1].toLowerCase() === "popular")) {
            if (args[2] === "en" || args[2] === "popular") {
                input = Functions.combineArgs(args, 3)
            } else {
                input = Functions.combineArgs(args, 2)
            }
        } else {
            input = Functions.combineArgs(args, 1)
        }
        const loading = message.channel.lastMessage
        loading?.delete()
        const msg1 = await message.channel.send(`**Fetching Ugoira** ${discord.getEmoji("gabCircle")}`) as Message
        let pixivID
        if (input.match(/\d\d\d+/g)) {
            pixivID = input.match(/\d+/g)!.join("")
        } else {
            if (args[1] && args[1].toLowerCase() === "r18") {
                if (!perms.checkNSFW()) return
                if (args[2] && args[2].toLowerCase() === "en") {
                    const image = await pixivApi.getPixivImage(input, true, true, true, true)
                    pixivID = image!.id
                } else {
                    const image = await pixivApi.getPixivImage(input, true, false, true, true)
                    pixivID = image!.id
                }
            } else if (args[1] && args[1].toLowerCase() === "en") {
                const image = await pixivApi.getPixivImage(input, false, true, true, true)
                pixivID = image!.id
            } else {
                const image = await pixivApi.getPixivImage(input, false, false, true, true)
                pixivID = image!.id
            }
        }
        if (String(pixivID).length > 14) return
        try {
            await pixiv.util.downloadUgoira(String(pixivID), `assets/images/gifs/`, {speed: 1.0})
        } catch {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
            .setTitle(`**Pixiv Ugoira** ${discord.getEmoji("chinoSmug")}`), "The provided url is not a ugoira.")
        }

        let details: PixivIllust
        try {
            details = await pixiv.illust.detail({illust_id: pixivID as number})
        } catch {
            msg1.delete({timeout: 1000})
            return
        }

        msg1.delete({timeout: 1000})
        const ugoiraEmbed = embeds.createEmbed()
        const outGif = new MessageAttachment(path.join(__dirname, `../../../assets/images/gifs/${pixivID}.gif`))
        const comments = await pixiv.illust.comments({illust_id: pixivID as number})
        const cleanText = details.caption.replace(/<\/?[^>]+(>|$)/g, "")
        const authorUrl = await pixiv.util.downloadProfilePicture(details, `assets/images/pixiv/profiles`)
        const authorAttachment = new MessageAttachment(authorUrl, "author.png")
        const commentArray: string[] = []
        for (let i = 0; i <= 5; i++) {
                    if (!comments.comments[i]) break
                    commentArray.push(comments.comments[i].comment)
                }
        ugoiraEmbed
        .setAuthor("pixiv", "https://dme8nb6778xpo.cloudfront.net/images/app/service_logos/12/0f3b665db199/large.png?1532986814")
        .setTitle(`**Pixiv Ugoira** ${discord.getEmoji("chinoSmug")}`)
        .setURL(`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${pixivID}`)
        .setDescription(
            `${discord.getEmoji("star")}_Title:_ **${details.title}**\n` +
            `${discord.getEmoji("star")}_Artist:_ **${details.user.name}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(new Date(details.create_date))}**\n` +
            `${discord.getEmoji("star")}_Views:_ **${details.total_view}**\n` +
            `${discord.getEmoji("star")}_Bookmarks:_ **${details.total_bookmarks}**\n` +
            `${discord.getEmoji("star")}_Description:_ ${cleanText ? cleanText : "None"}\n` +
            `${discord.getEmoji("star")}_Comments:_ ${commentArray.join() ? commentArray.join() : "None"}\n`
            )
        .attachFiles([outGif.attachment as string, authorAttachment])
        .setThumbnail(`attachment://author.png`)
        .setImage(`attachment://${pixivID}.gif`)
        const msg = await message.channel.send(ugoiraEmbed)
        const reactions = ["reverse"]
        await msg.react(discord.getEmoji(reactions[0]))
        const reverseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("reverse") && user.bot === false
        const reverse = msg.createReactionCollector(reverseCheck)
        reverse.on("collect", async (reaction, user) => {
            let factor = 1.0
            let setReverse = false
            await reaction.users.remove(user)
            async function getSpeedChange(response: Message) {
                response.content = response.content.replace("x", "")
                if (response.content.includes("reverse")) {
                    setReverse = true
                    response.content = response.content.replace("reverse", "")
                }
                if (response.content?.trim() && Number.isNaN(Number(response.content))) {
                    const rep = await response.reply("You must pass a valid speed factor, eg. \`1.5x\` or \`0.5x\`.")
                    rep.delete({timeout: 3000})
                } else {
                    factor = Number(response.content)
                }
                await response.delete()
            }
            const rep = await this.message.channel.send(`<@${user.id}>, Enter the speed change for this ugoira, eg \`2.0\`. Type \`reverse\` to also reverse the frames.`)
            await embeds.createPrompt(getSpeedChange)
            rep.delete()
            await pixiv.util.downloadUgoira(String(pixivID), `assets/images/gifs/`, {speed: factor, reverse: setReverse})
            const outGif = new MessageAttachment(path.join(__dirname, `../../../assets/images/gifs/${pixivID}.gif`))
            await message.channel.send(outGif)
        })
    }
}

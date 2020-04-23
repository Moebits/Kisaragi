import {Collection, Emoji, Message, MessageAttachment, MessageCollector, MessageEmbed, MessageEmbedThumbnail, MessageReaction, ReactionEmoji, User} from "discord.js"
import fs from "fs"
import path from "path"
import {Functions} from "./Functions"
import {Images} from "./Images"
import {Kisaragi} from "./Kisaragi.js"
import {SQLQuery} from "./SQLQuery"

const colors = new Collection()

export class Embeds {
    private readonly functions = new Functions(this.message)
    private readonly sql = new SQLQuery(this.message)
    private readonly images = new Images(this.discord, this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    /** Updates the guild embed color */
    public updateColor = async () => {
        const color = await this.sql.fetchColumn("config", "embed colors")
        if (!color || String(color) === "default") {
            colors.set(this.message.guild?.id, "default")
        } else if (String(color) === "random") {
            colors.set(this.message.guild?.id, "RANDOM")
        } else {
            colors.set(this.message.guild?.id, color)
        }
    }

    /** Creates a basic embed */
    public createEmbed = () => {
        let color = colors.has(this.message?.guild?.id) ? colors.get(this.message?.guild?.id) : Functions.randomColor() as any
        if (Array.isArray(color)) color = color[Math.floor(Math.random()*color.length)]
        if (color === "default") color = Functions.randomColor()
        const embed = new MessageEmbed()
        embed
        .setColor(color)
        .setTimestamp(embed.timestamp!)
        .setFooter(`Responded in ${this.functions.responseTime()}`, this.message?.author?.displayAvatarURL({format: "png", dynamic: true}))
        return embed
    }

    /** Updates an embed */
    public updateEmbed = async (embeds: MessageEmbed[], page: number, user: User, msg?: Message, help?: boolean, helpIndex?: number, cmdCount?: number[]) => {
        if (!embeds[page]) return
        if (msg) await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
        if (help) {
            if (!helpIndex) helpIndex = 0
            const name = embeds[page].title!.replace(/(<)(.*?)(>)/g, "").replace(/\*/g, "")
            embeds[page].setFooter(`${name} (${cmdCount?.[page]}) • Page ${helpIndex + 1}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
            return embeds[page]
        } else {
            embeds[page].setFooter(`Page ${page + 1}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
            return embeds[page]
        }
    }

    // Add active embed to Redis
    public redisAddEmbed = async (msg: Message) => {
        await this.sql.redisSet(msg.id, "true", 3600)
    }

    // Create Reaction Embed
    public createReactionEmbed = async (embeds: MessageEmbed[], collapseOn?: boolean, download?: boolean, startPage?: number) => {
        let page = 0
        if (startPage) page = startPage
        const insertEmbeds = embeds
        await this.updateEmbed(embeds, page, this.message.author!)
        const reactions: Emoji[] = [this.discord.getEmoji("right"), this.discord.getEmoji("left"), this.discord.getEmoji("tripleRight"), this.discord.getEmoji("tripleLeft")]
        const msg = await this.message.channel.send(embeds[page])
        for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i] as ReactionEmoji)

        if (collapseOn) {
            const description: string[] = []
            const thumbnail: MessageEmbedThumbnail[] = []
            let collapsed = false
            for (let i = 0; i < embeds.length; i++) {
                description.push(embeds[i].description!)
                thumbnail.push((embeds[i].thumbnail!))
            }
            await msg.react(this.discord.getEmoji("collapse"))
            const collapseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("collapse") && user.bot === false
            const collapse = msg.createReactionCollector(collapseCheck)

            collapse.on("collect", async (reaction: MessageReaction, user: User) => {
                if (!collapsed) {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("")
                        embeds[i].setThumbnail("")
                    }
                    collapsed = true
                } else {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i]?.url ?? "")
                    }
                    collapsed = false
                }
                const embed = await this.updateEmbed(embeds, page, user)
                msg.edit(embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        if (download) {
            const downloadCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("download") && user.bot === false
            const download = msg.createReactionCollector(downloadCheck)

            download.on("collect", async (reaction: MessageReaction, user: User) => {
                const images: string[] = []
                for (let i = 0; i < embeds.length; i++) {
                    if (embeds[i].image?.url) {
                        images.push(embeds[i].image?.url!)
                    }
                }
                await reaction.users.remove(user).catch(() => null)
                download.stop()
                const rep = await msg.channel.send(`<@${user.id}>, **Downloading the images, please wait** ${this.discord.getEmoji("gabCircle")}`)
                const rand = Math.floor(Math.random()*10000)
                const src = path.join(__dirname, `../../assets/images/dump/${rand}/`)
                const dest = path.join(__dirname, `../../assets/images/dump/${rand}.zip`)
                if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
                await this.images.downloadImages(images, src)
                const downloads = fs.readdirSync(src).map((m) => src + m)
                await Functions.createZip(downloads, dest)
                if (rep) rep.delete()
                const stats = fs.statSync(dest)
                if (stats.size > 8000000) {
                    const link = await this.images.upload(dest)
                    const downloadEmbed = this.createEmbed()
                    downloadEmbed
                    .setAuthor("download", "https://cdn.discordapp.com/emojis/685894156647661579.gif")
                    .setTitle(`**Image Download** ${this.discord.getEmoji("chinoSmug")}`)
                    .setDescription(`${this.discord.getEmoji("star")}Downloaded **${downloads.length}** images from this embed. This file is too large for attachments, download it [**here**](${link})`)
                    await msg.channel.send(downloadEmbed)
                } else {
                    const cleanTitle = embeds[0].title?.trim().replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/, "").trim() || "None"
                    const attachment = new MessageAttachment(dest, `${cleanTitle}.zip`)
                    await msg.channel.send(`<@${user.id}>, downloaded **${downloads.length}** images from this embed.`, attachment)
                }
                Functions.removeDirectory(src)
            })
        }
        await msg.react(this.discord.getEmoji("numberSelect"))
        if (download) await msg.react(this.discord.getEmoji("download"))
        const forwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("right") && user.bot === false
        const backwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("left") && user.bot === false
        const tripleForwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("tripleRight") && user.bot === false
        const tripleBackwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("tripleLeft") && user.bot === false
        const numberSelectCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("numberSelect") && user.bot === false

        const forward = msg.createReactionCollector(forwardCheck)
        const backward = msg.createReactionCollector(backwardCheck)
        const tripleForward = msg.createReactionCollector(tripleForwardCheck)
        const tripleBackward = msg.createReactionCollector(tripleBackwardCheck)
        const numberSelect = msg.createReactionCollector(numberSelectCheck)

        await SQLQuery.insertInto("collectors", "message", msg.id)
        await this.sql.updateColumn("collectors", "embeds", insertEmbeds, "message", msg.id)
        await this.sql.updateColumn("collectors", "collapse", collapseOn, "message", msg.id)
        await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
        await this.sql.updateColumn("collectors", "download", download, "message", msg.id)

        backward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = embeds.length - 1
            } else {
                page--
            }
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        forward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0
            } else {
                page++
            }
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleBackward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = (embeds.length - 1) - Math.floor(embeds.length/5)
            } else {
                page -= Math.floor(embeds.length/5)
            }
            if (page < 0) page *= -1
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleForward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0 + Math.floor(embeds.length/5)
            } else {
                page += Math.floor(embeds.length/5)
            }
            if (page > embeds.length - 1) page -= embeds.length - 1
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        numberSelect.on("collect", async (reaction: MessageReaction, user: User) => {
            const self = this
            async function getPageNumber(response: Message) {
                if (Number.isNaN(Number(response.content)) || Number(response.content) > embeds.length) {
                    const rep = await response.reply("That page number is invalid.")
                    await rep.delete({timeout: 2000})
                } else {
                    page = Number(response.content) - 1
                    const embed = await self.updateEmbed(embeds, page, user, msg)
                    msg.edit(embed)
                }
                await response.delete()
            }
            const numReply = await msg.channel.send(`<@${user.id}>, Enter the page number to jump to.`)
            await reaction.users.remove(user).catch(() => null)
            await this.createPrompt(getPageNumber)
            await numReply.delete()
        })
    }

    // Re-trigger Existing Reaction Embed
    public editReactionCollector = async (msg: Message, emoji: string, user: User, embeds: MessageEmbed[], collapseOn?: boolean, download?: boolean, startPage?: number) => {
        let page = 0
        if (startPage) page = startPage
        await this.updateEmbed(embeds, page, this.message.author!, msg)
        const description: string[] = []
        const thumbnail: MessageEmbedThumbnail[] = []
        for (let i = 0; i < embeds.length; i++) {
                description.push(embeds[i].description!)
                thumbnail.push(embeds[i].thumbnail!)
            }
        switch (emoji) {
            case "right":
                    if (page === embeds.length - 1) {
                        page = 0
                    } else {
                        page++
                    }
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    msg.edit(embeds[page])
                    break
            case "left":
                    if (page === 0) {
                        page = embeds.length - 1
                    } else {
                        page--
                    }
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    msg.edit(embeds[page])
                    break

            case "tripleRight":
                    if (page === embeds.length - 1) {
                        page = 0
                    } else {
                        page++
                    }
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    msg.edit(embeds[page])
                    break
            case "tripleLeft":
                    if (page === 0) {
                        page = (embeds.length - 1) - Math.floor(embeds.length/5)
                    } else {
                        page -= Math.floor(embeds.length/5)
                    }
                    if (page < 0) page *= -1
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    msg.edit(embeds[page])
                    break
            case "numberSelect":
                    // Do nothing
                    break
            case "download":
                    // Do nothing
                    break
            case "collapse":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i]?.url ?? "")
                    }
                    msg.edit(embeds[page])
                    break
            default:
        }

        await msg.react(this.discord.getEmoji("repost"))
        const forwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("right") && user.bot === false
        const backwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("left") && user.bot === false
        const tripleForwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("tripleRight") && user.bot === false
        const tripleBackwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("tripleLeft") && user.bot === false
        const repostCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("repost") && user.bot === false

        const forward = msg.createReactionCollector(forwardCheck)
        const backward = msg.createReactionCollector(backwardCheck)
        const tripleForward = msg.createReactionCollector(tripleForwardCheck)
        const tripleBackward = msg.createReactionCollector(tripleBackwardCheck)
        const repost = msg.createReactionCollector(repostCheck)

        if (collapseOn) {
            const collapseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("collapse") && user.bot === false
            const collapse = msg.createReactionCollector(collapseCheck)
            let collapsed = false

            collapse.on("collect", async (reaction: MessageReaction, user: User) => {
                if (!collapsed) {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("")
                        embeds[i].setThumbnail("")
                    }
                    collapsed = true
                } else {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i]?.url ?? "")
                    }
                    collapsed = false
                }
                const embed = await this.updateEmbed(embeds, page, user)
                msg.edit(embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        if (download) {
            const downloadCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("download") && user.bot === false
            const download = msg.createReactionCollector(downloadCheck)

            download.on("collect", async (reaction: MessageReaction, user: User) => {
                const images: string[] = []
                for (let i = 0; i < embeds.length; i++) {
                    if (embeds[i].image?.url) {
                        images.push(embeds[i].image?.url!)
                    }
                }
                await reaction.users.remove(user).catch(() => null)
                download.stop()
                const rep = await msg.channel.send(`<@${user.id}>, **Downloading the images, please wait** ${this.discord.getEmoji("gabCircle")}`)
                const rand = Math.floor(Math.random()*10000)
                const src = path.join(__dirname, `../../assets/images/dump/${rand}/`)
                const dest = path.join(__dirname, `../../assets/images/dump/${rand}.zip`)
                if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
                await this.images.downloadImages(images, src)
                const downloads = fs.readdirSync(src).map((m) => src + m)
                await Functions.createZip(downloads, dest)
                if (rep) rep.delete()
                const cleanTitle = embeds[0].title?.trim().replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/, "").trim() || "None"
                const attachment = new MessageAttachment(dest, `${cleanTitle}.zip`)
                await msg.channel.send(`<@${user.id}>, downloaded **${downloads.length}** images from this embed.`, attachment)
                Functions.removeDirectory(src)
            })
        }

        backward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = embeds.length - 1
            } else {
                page--
            }
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        forward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0
            } else {
                page++
            }
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleBackward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = (embeds.length - 1) - Math.floor(embeds.length/5)
            } else {
                page -= Math.floor(embeds.length/5)
            }
            if (page < 0) page *= -1
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleForward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0 + Math.floor(embeds.length/5)
            } else {
                page += Math.floor(embeds.length/5)
            }
            if (page > embeds.length - 1) page -= embeds.length - 1
            const embed = await this.updateEmbed(embeds, page, user, msg)
            msg.edit(embed)
            await reaction.users.remove(user).catch(() => null)
        })

        repost.on("collect", async (reaction: MessageReaction, user: User) => {
            await this.message.channel.send(`<@${user.id}>, I reposted this embed.`)
            await this.createReactionEmbed(embeds)
            await reaction.users.remove(user).catch(() => null)
        })
    }

    // Create Help Embed
    public createHelpEmbed = async (embeds: MessageEmbed[]) => {
        let page = 8
        const titles = ["Admin", "Anime", "Bot Developer", "Config", "Fun", "Game", "Heart", "Image", "Info", "Weeb", "Level", "Lewd", "Misc", "Misc 2", "Mod", "Music", "Music 2", "Music 3", "Video", "Waifu", "Website", "Website 2", "Website 3"]
        let compressed = false
        const longDescription: string[] = []
        const commandCount: number[] = []
        for (let i = 0; i < embeds.length; i++) {
            longDescription.push(embeds[i].description!)
        }
        const shortDescription: string[] = []
        for (let i = 0; i < longDescription.length; i++) {
            const top = longDescription[i].match(/(^)(.*?)(>)/g)?.[0]
            let text = longDescription[i].replace(top!, "").trim()
            const second = text.match(/(^)(.*?)(>)/g)?.[0]
            text = text.replace(second!, "").trim()
            const commands = text.match(/(`)(.*?)(`)/gm)
            commandCount.push(commands?.map((c)=>c)?.length ?? 0)
            const desc = `${top}\n${second}\n_Click on a reaction twice to toggle compact mode._\n${commands?.map((c) => c).join(", ")}`
            shortDescription.push(desc)
        }
        for (let i = 0; i < embeds.length; i++) {
            embeds[i].setFooter(`${titles[i]} Commands (${commandCount[i]}) • Page ${i + 1}/${embeds.length}`, this.message.author.displayAvatarURL({format: "png", dynamic: true}))
        }
        const page1 = [
            this.discord.getEmoji("arrowRight"),
            this.discord.getEmoji("admin"),
            this.discord.getEmoji("anime"),
            this.discord.getEmoji("config"),
            this.discord.getEmoji("fun"),
            this.discord.getEmoji("game"),
            this.discord.getEmoji("heart"),
            this.discord.getEmoji("image"),
            this.discord.getEmoji("info"),
            this.discord.getEmoji("japanese"),
            this.discord.getEmoji("level"),
            this.discord.getEmoji("lewd"),
            this.discord.getEmoji("misc"),
            this.discord.getEmoji("mod"),
            this.discord.getEmoji("music"),
            this.discord.getEmoji("musicTwo"),
            this.discord.getEmoji("video"),
            this.discord.getEmoji("waifu"),
            this.discord.getEmoji("website"),
            this.discord.getEmoji("websiteTwo")
        ]

        const page2 = [
            this.discord.getEmoji("arrowLeft"),
            this.discord.getEmoji("musicThree"),
            this.discord.getEmoji("miscTwo"),
            this.discord.getEmoji("websiteThree"),
            this.discord.getEmoji("botDeveloper")
        ]

        const pages = [page1, page2]
        let pageIndex = 0
        const msg = await this.message.channel.send(embeds[page])
        await SQLQuery.insertInto("collectors", "message", msg.id)
        await this.sql.updateColumn("collectors", "embeds", embeds, "message", msg.id)
        await this.sql.updateColumn("collectors", "collapse", true, "message", msg.id)
        await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
        await this.sql.updateColumn("collectors", "help", true, "message", msg.id)
        for (let i = 0; i < page1.length; i++) await msg.react(page1[i])

        const adminCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("admin") && user.bot === false
        const animeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("anime") && user.bot === false
        const botDevCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("botDeveloper") && user.bot === false
        const configCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("config") && user.bot === false
        const funCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("fun") && user.bot === false
        const gameCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("game") && user.bot === false
        const heartCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("heart") && user.bot === false
        const lewdCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("lewd") && user.bot === false
        const infoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("info") && user.bot === false
        const japaneseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("japanese") && user.bot === false
        const levelCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("level") && user.bot === false
        const imageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("image") && user.bot === false
        const miscCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("misc") && user.bot === false
        const miscTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("miscTwo") && user.bot === false
        const modCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("mod") && user.bot === false
        const musicCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("music") && user.bot === false
        const musicTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("musicTwo") && user.bot === false
        const musicThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("musicThree") && user.bot === false
        const videoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("video") && user.bot === false
        const waifuCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("waifu") && user.bot === false
        const webCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("website") && user.bot === false
        const webTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("websiteTwo") && user.bot === false
        const webThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("websiteThree") && user.bot === false
        const leftCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("arrowLeft") && user.bot === false
        const rightCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("arrowRight") && user.bot === false

        const admin = msg.createReactionCollector(adminCheck)
        const anime = msg.createReactionCollector(animeCheck)
        const botDev = msg.createReactionCollector(botDevCheck)
        const config = msg.createReactionCollector(configCheck)
        const fun = msg.createReactionCollector(funCheck)
        const game = msg.createReactionCollector(gameCheck)
        const heart = msg.createReactionCollector(heartCheck)
        const lewd = msg.createReactionCollector(lewdCheck)
        const info = msg.createReactionCollector(infoCheck)
        const japanese = msg.createReactionCollector(japaneseCheck)
        const level = msg.createReactionCollector(levelCheck)
        const image = msg.createReactionCollector(imageCheck)
        const misc = msg.createReactionCollector(miscCheck)
        const miscTwo = msg.createReactionCollector(miscTwoCheck)
        const mod = msg.createReactionCollector(modCheck)
        const music = msg.createReactionCollector(musicCheck)
        const musicTwo = msg.createReactionCollector(musicTwoCheck)
        const musicThree = msg.createReactionCollector(musicThreeCheck)
        const video = msg.createReactionCollector(videoCheck)
        const waifu = msg.createReactionCollector(waifuCheck)
        const web = msg.createReactionCollector(webCheck)
        const webTwo = msg.createReactionCollector(webTwoCheck)
        const webThree = msg.createReactionCollector(webThreeCheck)
        const left = msg.createReactionCollector(leftCheck)
        const right = msg.createReactionCollector(rightCheck)

        const collectors = [admin, anime, botDev, config, fun, game, heart, image, info, japanese, level, lewd, misc, miscTwo, mod, music, musicTwo, musicThree, video, waifu, web, webTwo, webThree]

        for (let i = 0; i < collectors.length; i++) {
            collectors[i].on("collect", async (reaction: MessageReaction, user: User) => {
                if (page === i) {
                    if (!compressed) {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription(shortDescription[i])
                        }
                        compressed = true
                    } else {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription(longDescription[i])
                        }
                        compressed = false
                    }
                }
                const filtered = pages.flat(Infinity).filter((e) => {
                    if (e.name === "arrowLeft" || e.name === "arrowRight") {
                        return false
                    } else {
                        return true
                    }
                })
                const curr = filtered.findIndex((e) => e.name === reaction.emoji.name)
                page = i
                const embed = await this.updateEmbed(embeds, page, user, msg, true, curr, commandCount)
                msg.edit(embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        right.on("collect", async (reaction: MessageReaction, user: User) => {
            if (pageIndex === pages.length - 1) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex++
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
        })

        left.on("collect", async (reaction: MessageReaction, user: User) => {
            if (pageIndex === 0) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex--
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
        })
    }

    // Re-trigger Help Embed
    public editHelpEmbed = (msg: Message, emoji: string, user: User, embeds: MessageEmbed[]) => {
        const emojiMap: string[] = [
            "admin", "anime", "config", "fun", "game",
            "heart", "image", "info", "japanese", "lewd", "misc",
            "miscTwo", "mod", "music", "musicTwo", "musicThree", "video", "waifu",
            "website", "websiteTwo", "websiteThree", "level", "botDeveloper"
        ]
        let compressed = false
        const longDescription: string[] = []
        const commandCount: number[] = []
        for (let i = 0; i < embeds.length; i++) {
            longDescription.push(embeds[i].description!)
        }
        const shortDescription: string[] = []
        for (let i = 0; i < longDescription.length; i++) {
            const top = longDescription[i].match(/(^)(.*?)(>)/g)?.[0]
            let text = longDescription[i].replace(top!, "").trim()
            const second = text.match(/(^)(.*?)(>)/g)?.[0]
            text = text.replace(second!, "").trim()
            const commands = text.match(/(`)(.*?)(`)/gm)
            commandCount.push(commands?.map((c)=>c)?.length ?? 0)
            const desc = `${top}\n${second}\n_Click on a reaction twice to toggle compact mode._\n${commands?.map((c) => c).join(", ")}`
            shortDescription.push(desc)
        }
        let page = emojiMap.indexOf(emoji) || 0
        msg.edit(embeds[page])

        const page1 = [
            this.discord.getEmoji("arrowRight"),
            this.discord.getEmoji("admin"),
            this.discord.getEmoji("anime"),
            this.discord.getEmoji("config"),
            this.discord.getEmoji("fun"),
            this.discord.getEmoji("game"),
            this.discord.getEmoji("heart"),
            this.discord.getEmoji("image"),
            this.discord.getEmoji("info"),
            this.discord.getEmoji("japanese"),
            this.discord.getEmoji("level"),
            this.discord.getEmoji("lewd"),
            this.discord.getEmoji("misc"),
            this.discord.getEmoji("mod"),
            this.discord.getEmoji("music"),
            this.discord.getEmoji("musicTwo"),
            this.discord.getEmoji("video"),
            this.discord.getEmoji("waifu"),
            this.discord.getEmoji("website"),
            this.discord.getEmoji("websiteTwo")
        ]

        const page2 = [
            this.discord.getEmoji("arrowLeft"),
            this.discord.getEmoji("musicThree"),
            this.discord.getEmoji("miscTwo"),
            this.discord.getEmoji("websiteThree"),
            this.discord.getEmoji("botDeveloper")
        ]

        const pages = [page1, page2]
        let pageIndex = 0
        if (msg.reactions.cache.find((r) => r.emoji.name === "botDeveloper")) pageIndex = 1

        const adminCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("admin") && user.bot === false
        const animeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("anime") && user.bot === false
        const botDevCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("botDeveloper") && user.bot === false
        const configCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("config") && user.bot === false
        const funCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("fun") && user.bot === false
        const gameCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("game") && user.bot === false
        const heartCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("heart") && user.bot === false
        const lewdCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("lewd") && user.bot === false
        const infoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("info") && user.bot === false
        const japaneseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("japanese") && user.bot === false
        const levelCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("level") && user.bot === false
        const imageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("image") && user.bot === false
        const miscCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("misc") && user.bot === false
        const miscTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("miscTwo") && user.bot === false
        const modCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("mod") && user.bot === false
        const musicCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("music") && user.bot === false
        const musicTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("musicTwo") && user.bot === false
        const musicThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("musicThree") && user.bot === false
        const videoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("video") && user.bot === false
        const waifuCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("waifu") && user.bot === false
        const webCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("website") && user.bot === false
        const webTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("websiteTwo") && user.bot === false
        const webThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("websiteThree") && user.bot === false
        const leftCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("arrowLeft") && user.bot === false
        const rightCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("arrowRight") && user.bot === false

        const admin = msg.createReactionCollector(adminCheck)
        const anime = msg.createReactionCollector(animeCheck)
        const botDev = msg.createReactionCollector(botDevCheck)
        const config = msg.createReactionCollector(configCheck)
        const fun = msg.createReactionCollector(funCheck)
        const game = msg.createReactionCollector(gameCheck)
        const heart = msg.createReactionCollector(heartCheck)
        const lewd = msg.createReactionCollector(lewdCheck)
        const info = msg.createReactionCollector(infoCheck)
        const japanese = msg.createReactionCollector(japaneseCheck)
        const level = msg.createReactionCollector(levelCheck)
        const image = msg.createReactionCollector(imageCheck)
        const misc = msg.createReactionCollector(miscCheck)
        const miscTwo = msg.createReactionCollector(miscTwoCheck)
        const mod = msg.createReactionCollector(modCheck)
        const music = msg.createReactionCollector(musicCheck)
        const musicTwo = msg.createReactionCollector(musicTwoCheck)
        const musicThree = msg.createReactionCollector(musicThreeCheck)
        const video = msg.createReactionCollector(videoCheck)
        const waifu = msg.createReactionCollector(waifuCheck)
        const web = msg.createReactionCollector(webCheck)
        const webTwo = msg.createReactionCollector(webTwoCheck)
        const webThree = msg.createReactionCollector(webThreeCheck)
        const left = msg.createReactionCollector(leftCheck)
        const right = msg.createReactionCollector(rightCheck)

        const collectors = [admin, anime, botDev, config, fun, game, heart, image, info, japanese, level, lewd, misc, miscTwo, mod, music, musicTwo, musicThree, video, waifu, web, webTwo, webThree]

        for (let i = 0; i < collectors.length; i++) {
            collectors[i].on("collect", async (reaction: MessageReaction, user: User) => {
                if (page === i) {
                    if (!compressed) {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription(shortDescription[i])
                        }
                        compressed = true
                    } else {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription(longDescription[i])
                        }
                        compressed = false
                    }
                }
                const filtered = pages.flat(Infinity).filter((e) => {
                    if (e.name === "arrowLeft" || e.name === "arrowRight") {
                        return false
                    } else {
                        return true
                    }
                })
                const curr = filtered.findIndex((e) => e.name === reaction.emoji.name)
                page = i
                const embed = await this.updateEmbed(embeds, page, user, msg, true, curr, commandCount)
                msg.edit(embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        right.on("collect", async (reaction: MessageReaction, user: User) => {
            if (pageIndex === pages.length - 1) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex++
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
        })

        left.on("collect", async (reaction: MessageReaction, user: User) => {
            if (pageIndex === 0) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex--
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
        })
    }

    // Create Prompt
    public createPrompt = (func: (message: Message, collector: MessageCollector) => void, infinite?: boolean): Promise<void> => {
        const filter = (m: Message) => m.author!.id === this.message.author!.id && m.channel === this.message.channel
        const collector = this.message.channel.createMessageCollector(filter, {time: infinite ? undefined : 120000})
        return new Promise((resolve) => {
            collector.on("collect", (m: Message) => {
                func(m, collector)
                collector.stop()
            })

            collector.on("end", async (collector, reason) => {
                if (reason === "time") {
                    const time = await this.message.reply(`Ended the prompt because you took too long to answer.`)
                    time.delete({timeout: 600000})
                }
                resolve()
            })
        })
    }
}

import {Collection, Emoji, GuildEmoji, Message, AttachmentBuilder, MessageCollector, EmbedBuilder, 
APIEmbedThumbnail, MessageReaction, ReactionEmoji, TextChannel, User, ChatInputCommandInteraction} from "discord.js"
import {CommandFunctions} from "./CommandFunctions"
import {Functions} from "./Functions"
import {Images} from "./Images"
import {Kisaragi} from "./Kisaragi.js"
import {SQLQuery} from "./SQLQuery"
import fs from "fs"
import path from "path"

const colors = new Collection()

export class Embeds {
    private readonly functions: Functions
    private readonly sql: SQLQuery
    private readonly images: Images
    
    constructor(private readonly discord: Kisaragi, private readonly message: Message<true>) {
        this.functions = new Functions(this.message)
        this.sql = new SQLQuery(this.message)
        this.images = new Images(this.discord, this.message)
    }

    /** Updates the guild embed color */
    public updateColor = async () => {
        const color = await this.sql.fetchColumn("guilds", "embed colors")
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
        const embed = new EmbedBuilder()
        embed
        .setColor(color)
        .setTimestamp(Date.now())
        .setFooter({text: `Responded in ${this.functions.responseTime()}`, iconURL: this.message?.author?.displayAvatarURL({extension: "png"})})
        return embed
    }

    /** Updates an embed */
    public updateEmbed = async (embeds: EmbedBuilder[], page: number, user: User, msg?: Message<true>, help?: boolean, helpIndex?: number, cmdCount?: number[]) => {
        if (!embeds[page]) return null
        if (msg) await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
        if (help) {
            if (!helpIndex) helpIndex = 0
            const name = embeds[page].data.title!.replace(/(<)(.*?)(>)/g, "").replace(/\*/g, "")
            embeds[page].setFooter({text: `${name} (${cmdCount?.[page]}) • Page ${helpIndex + 1}/${embeds.length}`, iconURL: user.displayAvatarURL({extension: "png"})})
            return embeds[page]
        } else {
            embeds[page].setFooter({text: `Page ${page + 1}/${embeds.length}`, iconURL: user.displayAvatarURL({extension: "png"})})
            return embeds[page]
        }
    }

    /** Create Reaction Embed */
    public createReactionEmbed = async (embeds: EmbedBuilder[], collapseOn?: boolean, download?: boolean, startPage?: number, dm?: User) => {
        let page = 0
        if (startPage) page = startPage - 1
        const insertEmbeds = embeds
        await this.updateEmbed(embeds, page, this.message.author!)
        const reactions: Emoji[] = [this.discord.getEmoji("right"), this.discord.getEmoji("left"), this.discord.getEmoji("tripleRight"), this.discord.getEmoji("tripleLeft")]
        let msg: Message<true>
        if (dm) {
            try {
                msg = await dm.send({embeds: [embeds[page]]}) as any
            } catch {
                return this.message
            }
        } else {
            msg = await this.discord.reply(this.message, embeds[page]) as Message<true>
        }
        for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i] as ReactionEmoji)

        if (collapseOn) {
            const description: string[] = []
            const thumbnail: APIEmbedThumbnail[] = []
            let collapsed = false
            for (let i = 0; i < embeds.length; i++) {
                description.push(embeds[i].data.description!)
                thumbnail.push((embeds[i].data.thumbnail!))
            }
            await msg.react(this.discord.getEmoji("collapse"))
            const collapseCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("collapse").id && user.bot === false
            const collapse = msg.createReactionCollector({filter: collapseCheck})

            collapse.on("collect", async (reaction: MessageReaction, user: User) => {
                if (!collapsed) {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(null)
                        embeds[i].setThumbnail(null)
                    }
                    collapsed = true
                } else {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i]?.url ?? null)
                    }
                    collapsed = false
                }
                const embed = await this.updateEmbed(embeds, page, user)
                if (embed) this.discord.edit(msg, embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        if (download) {
            const downloadCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("download").id && user.bot === false
            const download = msg.createReactionCollector({filter: downloadCheck})
            let downloaded = false

            download.on("collect", async (reaction: MessageReaction, user: User) => {
                await reaction.users.remove(user).catch(() => null)
                if (downloaded) return
                downloaded = true
                const images: string[] = []
                for (let i = 0; i < embeds.length; i++) {
                    if (embeds[i].data.image?.url) {
                        images.push(embeds[i].data.image?.url!)
                    }
                }
                const rep = await this.discord.send(msg, `<@${user.id}>, **Downloading the images, please wait** ${this.discord.getEmoji("gabCircle")}`)
                const rand = Math.floor(Math.random()*10000)
                const src = path.join(__dirname, `../assets/misc/images/dump/${rand}/`)
                const dest = path.join(__dirname, `../assets/misc/images/dump/${rand}.zip`)
                if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
                await this.images.downloadImages(images, src)
                const downloads = fs.readdirSync(src).map((m) => src + m)
                await Functions.createZip(downloads, dest)
                const stats = fs.statSync(dest)
                if (stats.size > 8000000) {
                    const link = await this.images.upload(dest)
                    const downloadEmbed = this.createEmbed()
                    downloadEmbed
                    .setAuthor({name: "download", iconURL: this.discord.checkMuted(reaction.message) ? "" : "https://cdn.discordapp.com/emojis/685894156647661579.gif"})
                    .setTitle(`**Image Download** ${this.discord.getEmoji("chinoSmug")}`)
                    .setDescription(`${this.discord.getEmoji("star")}Downloaded **${downloads.length}** images from this embed. This file is too large for attachments, download it [**here**](${link})`)
                    await this.discord.send(msg, downloadEmbed)
                } else {
                    const cleanTitle = embeds[0].data.title?.trim().replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/, "").trim() || "None"
                    const attachment = new AttachmentBuilder(dest, {name: `${cleanTitle}.zip`})
                    await this.discord.send(msg, `<@${user.id}>, downloaded **${downloads.length}** images from this embed.`, attachment)
                }
                if (rep) rep.delete()
                Functions.removeDirectory(src)
            })
        }
        if (!dm) await msg.react(this.discord.getEmoji("numberSelect"))
        if (download) await msg.react(this.discord.getEmoji("download"))
        await msg.react(this.discord.getEmoji("copy"))
        const forwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("right").id && user.bot === false
        const backwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("left").id && user.bot === false
        const tripleForwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("tripleRight").id && user.bot === false
        const tripleBackwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("tripleLeft").id && user.bot === false
        const numberSelectCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("numberSelect").id && user.bot === false
        const copyCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("copy").id && user.bot === false

        const forward = msg.createReactionCollector({filter: forwardCheck})
        const backward = msg.createReactionCollector({filter: backwardCheck})
        const tripleForward = msg.createReactionCollector({filter: tripleForwardCheck})
        const tripleBackward = msg.createReactionCollector({filter: tripleBackwardCheck})
        const numberSelect = msg.createReactionCollector({filter: numberSelectCheck})
        const copy = msg.createReactionCollector({filter: copyCheck})

        await SQLQuery.insertInto("collectors", "message", msg.id)
        await this.sql.updateColumn("collectors", "embeds", insertEmbeds, "message", msg.id)
        await this.sql.updateColumn("collectors", "collapse", collapseOn, "message", msg.id)
        await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
        await this.sql.updateColumn("collectors", "download", download, "message", msg.id)
        await this.sql.updateColumn("collectors", "timestamp", new Date().toISOString(), "message", msg.id)

        backward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = embeds.length - 1
            } else {
                page--
            }
            const embed = await this.updateEmbed(embeds, page, user, msg)
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        forward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0
            } else {
                page++
            }
            const embed = await this.updateEmbed(embeds, page, user, msg)
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleBackward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = (embeds.length - 1) - Math.floor(embeds.length/5)
            } else {
                page -= Math.floor(embeds.length/5)
            }
            if (page < 0) page += embeds.length
            const embed = await this.updateEmbed(embeds, page, user, msg)
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleForward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0 + Math.floor(embeds.length/5)
            } else {
                page += Math.floor(embeds.length/5)
            }
            if (page > embeds.length - 1) page -= embeds.length
            const embed = await this.updateEmbed(embeds, page, user, msg)
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        numberSelect.on("collect", async (reaction: MessageReaction, user: User) => {
            if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to use this function. ${this.discord.getEmoji("kannaFacepalm")}`)
                setTimeout(() => rep.delete(), 3000)
                return
            }
            const self = this
            async function getPageNumber(response: Message<true>) {
                if (Number.isNaN(Number(response.content)) || Number(response.content) > embeds.length) {
                    const rep = await response.reply("That page number is invalid.")
                    await new Promise<void>((resolve) => {
                        setTimeout(() => {
                            rep.delete()
                            resolve()
                        }, 2000)
                    })
                    await Functions.timeout(2000)
                    await rep.delete().catch(() => null)
                } else {
                    page = Number(response.content) - 1
                    const embed = await self.updateEmbed(embeds, page, user, msg)
                    if (embed) this.discord.edit(msg, embed)
                }
                await response.delete().catch(() => null)
            }
            const numReply = await this.discord.send(msg, `<@${user.id}>, Enter the page number to jump to.`)
            await reaction.users.remove(user).catch(() => null)
            await this.createPrompt(getPageNumber)
            await numReply.delete()
        })

        let copyOn = false
        copy.on("collect", async (reaction: MessageReaction, user: User) => {
            const id = msg.guild ? msg.guild.id : user.id
            await reaction.users.remove(user).catch(() => null)
            if (copyOn) return
            if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to use this function. ${this.discord.getEmoji("kannaFacepalm")}`)
                setTimeout(() => rep.delete(), 3000)
                return
            }
            const content = msg.embeds[0].description?.replace(/(<a:star)(.*?)(>)/g, "")
            if (!content) return
            const desc = await this.discord.send(msg, content)
            const rep = await this.discord.send(msg, `<@${user.id}>, copy the content in this embed (Deleting in **10** seconds).`)
            copyOn = true
            await Functions.timeout(10000)
            desc.delete()
            rep.delete()
            copyOn = false
        })

        return msg
    }

    // Re-trigger Existing Reaction Embed
    public editReactionCollector = async (msg: Message<true>, emoji: string, user: User, embeds: EmbedBuilder[], collapseOn?: boolean, download?: boolean, startPage?: number) => {
        let page = 0
        if (startPage) page = startPage
        await this.updateEmbed(embeds, page, this.message.author!, msg)
        const description: string[] = []
        const thumbnail: APIEmbedThumbnail[] = []
        for (let i = 0; i < embeds.length; i++) {
                description.push(embeds[i].data.description!)
                thumbnail.push(embeds[i].data.thumbnail!)
            }
        await msg.reactions.cache.find((r) => r.emoji.name === emoji)?.users.remove(user).catch(() => null)
        switch (emoji) {
            case "right":
                    if (page === embeds.length - 1) {
                        page = 0
                    } else {
                        page++
                    }
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    this.discord.edit(msg, embeds[page])
                    break
            case "left":
                    if (page === 0) {
                        page = embeds.length - 1
                    } else {
                        page--
                    }
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    this.discord.edit(msg, embeds[page])
                    break
            case "tripleRight":
                    if (page === embeds.length - 1) {
                        page = 0
                    } else {
                        page++
                    }
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    this.discord.edit(msg, embeds[page])
                    break
            case "tripleLeft":
                    if (page === 0) {
                        page = (embeds.length - 1) - Math.floor(embeds.length/5)
                    } else {
                        page -= Math.floor(embeds.length/5)
                    }
                    if (page < 0) page *= -1
                    await this.updateEmbed(embeds, page, this.message.author!, msg)
                    this.discord.edit(msg, embeds[page])
                    break
            case "numberSelect":
                    const rep3 = await this.discord.reply(msg, `The page selection function is disabled on old embeds. However, you can repost it.`)
                    setTimeout(() => rep3.delete(), 3000)
                    break
            case "download":
                    const images: string[] = []
                    for (let i = 0; i < embeds.length; i++) {
                        if (embeds[i].data.image?.url) {
                            images.push(embeds[i].data.image?.url!)
                        }
                    }
                    const rep = await this.discord.send(msg, `<@${user.id}>, **Downloading the images, please wait** ${this.discord.getEmoji("gabCircle")}`)
                    const rand = Math.floor(Math.random()*10000)
                    const src = path.join(__dirname, `../assets/misc/images/dump/${rand}/`)
                    const dest = path.join(__dirname, `../assets/misc/images/dump/${rand}.zip`)
                    if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
                    await this.images.downloadImages(images, src)
                    const downloads = fs.readdirSync(src).map((m) => src + m)
                    await Functions.createZip(downloads, dest)
                    const stats = fs.statSync(dest)
                    if (stats.size > 8000000) {
                        const link = await this.images.upload(dest)
                        const downloadEmbed = this.createEmbed()
                        downloadEmbed
                        .setAuthor({name: "download", iconURL: this.discord.checkMuted(msg) ? "" : "https://cdn.discordapp.com/emojis/685894156647661579.gif"})
                        .setTitle(`**Image Download** ${this.discord.getEmoji("chinoSmug")}`)
                        .setDescription(`${this.discord.getEmoji("star")}Downloaded **${downloads.length}** images from this embed. This file is too large for attachments, download it [**here**](${link})`)
                        await this.discord.send(msg, downloadEmbed)
                    } else {
                        const cleanTitle = embeds[0].data.title?.trim().replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/, "").trim() || "None"
                        const attachment = new AttachmentBuilder(dest, {name: `${cleanTitle}.zip`})
                        await this.discord.send(msg, `<@${user.id}>, downloaded **${downloads.length}** images from this embed.`, attachment)
                    }
                    if (rep) rep.delete()
                    Functions.removeDirectory(src)
                    break
            case "copy":
                    if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                        const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to use this function. ${this.discord.getEmoji("kannaFacepalm")}`)
                        setTimeout(() => rep.delete(), 3000)
                        return
                    }
                    const desc = await this.discord.send(msg, msg.embeds[0].description?.replace(/(<a:star)(.*?)(>)/g, "") ?? "")
                    const rep2 = await this.discord.send(msg, `<@${user.id}>, copy the content in this embed (Deleting in **10** seconds).`)
                    await Functions.timeout(10000)
                    desc.delete()
                    rep2.delete()
                    break
            case "collapse":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i]?.url ?? null)
                    }
                    this.discord.edit(msg, embeds[page])
                    break
            default:
        }

        await msg.react(this.discord.getEmoji("repost"))
        const forwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("right").id && user.bot === false
        const backwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("left").id && user.bot === false
        const tripleForwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("tripleRight").id && user.bot === false
        const tripleBackwardCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("tripleLeft").id && user.bot === false
        const numberSelectCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("numberSelect").id && user.bot === false
        const copyCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("copy").id && user.bot === false
        const repostCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("repost").id && user.bot === false

        const forward = msg.createReactionCollector({filter: forwardCheck})
        const backward = msg.createReactionCollector({filter: backwardCheck})
        const tripleForward = msg.createReactionCollector({filter: tripleForwardCheck})
        const tripleBackward = msg.createReactionCollector({filter: tripleBackwardCheck})
        const numberSelect = msg.createReactionCollector({filter: numberSelectCheck})
        const repost = msg.createReactionCollector({filter: repostCheck})
        const copy = msg.createReactionCollector({filter: copyCheck})

        if (collapseOn) {
            const collapseCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("collapse").id && user.bot === false
            const collapse = msg.createReactionCollector({filter: collapseCheck})
            let collapsed = false

            collapse.on("collect", async (reaction: MessageReaction, user: User) => {
                if (!collapsed) {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(null)
                        embeds[i].setThumbnail(null)
                    }
                    collapsed = true
                } else {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i]?.url ?? null)
                    }
                    collapsed = false
                }
                const embed = await this.updateEmbed(embeds, page, user)
                if (embed) this.discord.edit(msg, embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        if (download) {
            const downloadCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("download").id && user.bot === false
            const download = msg.createReactionCollector({filter: downloadCheck})
            let downloaded = false

            download.on("collect", async (reaction: MessageReaction, user: User) => {
                await reaction.users.remove(user).catch(() => null)
                if (downloaded) return
                downloaded = true
                const images: string[] = []
                for (let i = 0; i < embeds.length; i++) {
                    if (embeds[i].data.image?.url) {
                        images.push(embeds[i].data.image?.url!)
                    }
                }
                const rep = await this.discord.send(msg, `<@${user.id}>, **Downloading the images, please wait** ${this.discord.getEmoji("gabCircle")}`)
                const rand = Math.floor(Math.random()*10000)
                const src = path.join(__dirname, `../assets/misc/images/dump/${rand}/`)
                const dest = path.join(__dirname, `../assets/misc/images/dump/${rand}.zip`)
                if (!fs.existsSync(src)) fs.mkdirSync(src, {recursive: true})
                await this.images.downloadImages(images, src)
                const downloads = fs.readdirSync(src).map((m) => src + m)
                await Functions.createZip(downloads, dest)
                const stats = fs.statSync(dest)
                if (stats.size > 8000000) {
                    const link = await this.images.upload(dest)
                    const downloadEmbed = this.createEmbed()
                    downloadEmbed
                    .setAuthor({name: "download", iconURL: this.discord.checkMuted(reaction.message) ? "" : "https://cdn.discordapp.com/emojis/685894156647661579.gif"})
                    .setTitle(`**Image Download** ${this.discord.getEmoji("chinoSmug")}`)
                    .setDescription(`${this.discord.getEmoji("star")}Downloaded **${downloads.length}** images from this embed. This file is too large for attachments, download it [**here**](${link})`)
                    await this.discord.send(msg, downloadEmbed)
                } else {
                    const cleanTitle = embeds[0].data.title?.trim().replace(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/, "").trim() || "None"
                    const attachment = new AttachmentBuilder(dest, {name: `${cleanTitle}.zip`})
                    await this.discord.send(msg, `<@${user.id}>, downloaded **${downloads.length}** images from this embed.`, attachment)
                }
                if (rep) rep.delete()
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
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        forward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0
            } else {
                page++
            }
            const embed = await this.updateEmbed(embeds, page, user, msg)
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleBackward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = (embeds.length - 1) - Math.floor(embeds.length/5)
            } else {
                page -= Math.floor(embeds.length/5)
            }
            if (page < 0) page += embeds.length
            const embed = await this.updateEmbed(embeds, page, user, msg)
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        tripleForward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0 + Math.floor(embeds.length/5)
            } else {
                page += Math.floor(embeds.length/5)
            }
            if (page > embeds.length - 1) page -= embeds.length
            const embed = await this.updateEmbed(embeds, page, user, msg)
            if (embed) this.discord.edit(msg, embed)
            await reaction.users.remove(user).catch(() => null)
        })

        numberSelect.on("collect", async (reaction: MessageReaction, user: User) => {
            await reaction.users.remove(user).catch(() => null)
            const rep3 = await this.discord.reply(msg, `The page selection function is disabled on old embeds. However, you can repost it.`)
            setTimeout(() => rep3.delete(), 3000)
        })

        let copyOn = false
        copy.on("collect", async (reaction: MessageReaction, user: User) => {
            const id = msg.guild ? msg.guild.id : user.id
            await reaction.users.remove(user).catch(() => null)
            if (copyOn) return
            if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to use this function. ${this.discord.getEmoji("kannaFacepalm")}`)
                setTimeout(() => rep.delete(), 3000)
                return
            }
            const content = msg.embeds[0].description?.replace(/(<a:star)(.*?)(>)/g, "")
            if (!content) return
            const desc = await this.discord.send(msg, content)
            const rep = await this.discord.send(msg, `<@${user.id}>, copy the content in this embed (Deleting in **10** seconds).`)
            copyOn = true
            await Functions.timeout(10000)
            desc.delete()
            rep.delete()
            copyOn = false
        })

        repost.on("collect", async (reaction: MessageReaction, user: User) => {
            await this.discord.send(this.message, `<@${user.id}>, I reposted this embed.`)
            await this.createReactionEmbed(embeds, true, true)
            await reaction.users.remove(user).catch(() => null)
        })
    }

    /** Create Help Embed */
    public createHelpEmbed = async (embeds: EmbedBuilder[], reactionPage?: number) => {
        let page = 9
        if (reactionPage === 2) page = 17
        const titles = ["Admin", "Anime", "Booru", "Botdev", "Config", "Fun", "Game", "Heart", "Image", "Info", "Weeb", "Level", "Misc", "Misc 2", "Mod", "Music", "Music 2", "Music 3", "Reddit", "Twitter", "Video", "Waifu", "Website", "Website 2", "Website 3"]
        let compressed = false
        const longDescription: string[] = []
        const commandCount: number[] = []
        for (let i = 0; i < embeds.length; i++) {
            longDescription.push(embeds[i].data.description!)
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
            embeds[i].setFooter({text: `${titles[i]} Commands (${commandCount[i]}) • Page ${i + 1}/${embeds.length}`, iconURL: this.message.author.displayAvatarURL({extension: "png"})})
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
            this.discord.getEmoji("booru"),
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
            this.discord.getEmoji("reddit"),
            this.discord.getEmoji("twitter"),
            this.discord.getEmoji("miscTwo"),
            this.discord.getEmoji("websiteThree"),
            this.discord.getEmoji("botDeveloper")
        ]

        const pages = [page1, page2]
        let pageIndex = 0
        if (reactionPage === 2) pageIndex = 1
        let msg = await this.discord.reply(this.message, embeds[page]) as Message<true>
        await SQLQuery.insertInto("collectors", "message", msg.id)
        await this.sql.updateColumn("collectors", "embeds", embeds, "message", msg.id)
        await this.sql.updateColumn("collectors", "collapse", true, "message", msg.id)
        await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
        await this.sql.updateColumn("collectors", "help", true, "message", msg.id)
        if (reactionPage === 2) {
            for (let i = 0; i < page2.length; i++) await msg.react(page2[i])
            await msg.react(this.discord.getEmoji("dm"))
        } else {
            for (let i = 0; i < page1.length; i++) await msg.react(page1[i])
        }

        const adminCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("admin").id && user.bot === false
        const animeCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("anime").id && user.bot === false
        const booruCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("booru").id && user.bot === false
        const botDevCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("botDeveloper").id && user.bot === false
        const configCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("config").id && user.bot === false
        const funCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("fun").id && user.bot === false
        const gameCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("game").id && user.bot === false
        const heartCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("heart").id && user.bot === false
        const infoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("info").id && user.bot === false
        const japaneseCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("japanese").id && user.bot === false
        const levelCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("level").id && user.bot === false
        const imageCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("image").id && user.bot === false
        const miscCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("misc").id && user.bot === false
        const miscTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("miscTwo").id && user.bot === false
        const modCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("mod").id && user.bot === false
        const musicCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("music").id && user.bot === false
        const musicTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("musicTwo").id && user.bot === false
        const musicThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("musicThree").id && user.bot === false
        const redditCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("reddit").id && user.bot === false
        const twitterCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("twitter").id && user.bot === false
        const videoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("video").id && user.bot === false
        const waifuCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("waifu").id && user.bot === false
        const webCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("website").id && user.bot === false
        const webTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("websiteTwo").id && user.bot === false
        const webThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("websiteThree").id && user.bot === false
        const leftCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("arrowLeft").id && user.bot === false
        const rightCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("arrowRight").id && user.bot === false
        const dmCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("dm").id && user.bot === false

        const admin = msg.createReactionCollector({filter: adminCheck})
        const anime = msg.createReactionCollector({filter: animeCheck})
        const booru = msg.createReactionCollector({filter: booruCheck})
        const botDev = msg.createReactionCollector({filter: botDevCheck})
        const config = msg.createReactionCollector({filter: configCheck})
        const fun = msg.createReactionCollector({filter: funCheck})
        const game = msg.createReactionCollector({filter: gameCheck})
        const heart = msg.createReactionCollector({filter: heartCheck})
        const info = msg.createReactionCollector({filter: infoCheck})
        const japanese = msg.createReactionCollector({filter: japaneseCheck})
        const level = msg.createReactionCollector({filter: levelCheck})
        const image = msg.createReactionCollector({filter: imageCheck})
        const misc = msg.createReactionCollector({filter: miscCheck})
        const miscTwo = msg.createReactionCollector({filter: miscTwoCheck})
        const mod = msg.createReactionCollector({filter: modCheck})
        const music = msg.createReactionCollector({filter: musicCheck})
        const musicTwo = msg.createReactionCollector({filter: musicTwoCheck})
        const musicThree = msg.createReactionCollector({filter: musicThreeCheck})
        const reddit = msg.createReactionCollector({filter: redditCheck})
        const twitter = msg.createReactionCollector({filter: twitterCheck})
        const video = msg.createReactionCollector({filter: videoCheck})
        const waifu = msg.createReactionCollector({filter: waifuCheck})
        const web = msg.createReactionCollector({filter: webCheck})
        const webTwo = msg.createReactionCollector({filter: webTwoCheck})
        const webThree = msg.createReactionCollector({filter: webThreeCheck})
        const left = msg.createReactionCollector({filter: leftCheck})
        const right = msg.createReactionCollector({filter: rightCheck})
        const dm = msg.createReactionCollector({filter: dmCheck})

        const collectors = [admin, anime, booru, botDev, config, fun, game, heart, image, info, japanese, level, misc, miscTwo, mod, music, musicTwo, musicThree, reddit, twitter, video, waifu, web, webTwo, webThree]

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
                    if (Array.isArray(e)) return false
                    if (e.name === "arrowLeft" || e.name === "arrowRight") {
                        return false
                    } else {
                        return true
                    }
                }) as unknown as GuildEmoji[]
                const curr = filtered.findIndex((e) => e.name === reaction.emoji.name)
                page = i
                const embed = await this.updateEmbed(embeds, page, user, msg, true, curr, commandCount)
                if (embed) this.discord.edit(msg, embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        right.on("collect", async (reaction: MessageReaction, user: User) => {
            if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to remove every reaction on this message. You can use \`help 2\` to send the second page in a new message. ${this.discord.getEmoji("kannaFacepalm")}`)
                setTimeout(() => rep.delete(), 5000)
                return
            }
            if (pageIndex === pages.length - 1) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex++
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
            if (pageIndex === pages.length -1) await msg.react(this.discord.getEmoji("dm"))
        })

        left.on("collect", async (reaction: MessageReaction, user: User) => {
            if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to remove every reaction on this message. You can use \`help\` to send the first page in a new message. ${this.discord.getEmoji("kannaFacepalm")}`)
                setTimeout(() => rep.delete(), 5000)
                return
            }
            if (pageIndex === 0) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex--
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
        })

        const dmSet = new Set()
        dm.on("collect", async (reaction: MessageReaction, user: User) => {
            await reaction.users.remove(user).catch(() => null)
            if (dmSet.has(user.id)) return
            const msg = this.message
            msg.author = user
            const cmd = new CommandFunctions(this.discord, msg)
            await cmd.runCommand(msg, ["help", "dm", "delete"])
            dmSet.add(user.id)
        })
    }

    /** Re-trigger Help Embed */
    public editHelpEmbed = (msg: Message<true>, emoji: string, user: User, embeds: EmbedBuilder[]) => {
        const emojiMap: string[] = [
            "admin", "anime", "config", "fun", "game",
            "heart", "image", "info", "japanese", "level", "booru", "misc",
            "mod", "music", "musicTwo", "video", "waifu", "website", "websiteTwo",
            "musicThree", "reddit", "twitter", "miscTwo", "websiteThree", "botDeveloper"
        ]
        let compressed = false
        const longDescription: string[] = []
        const commandCount: number[] = []
        for (let i = 0; i < embeds.length; i++) {
            longDescription.push(embeds[i].data.description!)
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
        this.discord.edit(msg, embeds[page])

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
            this.discord.getEmoji("booru"),
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
            this.discord.getEmoji("reddit"),
            this.discord.getEmoji("twitter"),
            this.discord.getEmoji("miscTwo"),
            this.discord.getEmoji("websiteThree"),
            this.discord.getEmoji("botDeveloper")
        ]

        const pages = [page1, page2]
        let pageIndex = 0
        if (msg.reactions.cache.find((r) => r.emoji.name === "botDeveloper")) pageIndex = 1

        const adminCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("admin").id && user.bot === false
        const animeCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("anime").id && user.bot === false
        const botDevCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("botDeveloper").id && user.bot === false
        const configCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("config").id && user.bot === false
        const funCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("fun").id && user.bot === false
        const gameCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("game").id && user.bot === false
        const heartCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("heart").id && user.bot === false
        const booruCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("booru").id && user.bot === false
        const infoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("info").id && user.bot === false
        const japaneseCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("japanese").id && user.bot === false
        const levelCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("level").id && user.bot === false
        const imageCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("image").id && user.bot === false
        const miscCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("misc").id && user.bot === false
        const miscTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("miscTwo").id && user.bot === false
        const modCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("mod").id && user.bot === false
        const musicCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("music").id && user.bot === false
        const musicTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("musicTwo").id && user.bot === false
        const musicThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("musicThree").id && user.bot === false
        const redditCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("reddit").id && user.bot === false
        const twitterCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("twitter").id && user.bot === false
        const videoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("video").id && user.bot === false
        const waifuCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("waifu").id && user.bot === false
        const webCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("website").id && user.bot === false
        const webTwoCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("websiteTwo").id && user.bot === false
        const webThreeCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("websiteThree").id && user.bot === false
        const leftCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("arrowLeft").id && user.bot === false
        const rightCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("arrowRight").id && user.bot === false
        const dmCheck = (reaction: MessageReaction, user: User) => reaction.emoji.id === this.discord.getEmoji("dm").id && user.bot === false

        const admin = msg.createReactionCollector({filter: adminCheck})
        const anime = msg.createReactionCollector({filter: animeCheck})
        const botDev = msg.createReactionCollector({filter: botDevCheck})
        const config = msg.createReactionCollector({filter: configCheck})
        const fun = msg.createReactionCollector({filter: funCheck})
        const game = msg.createReactionCollector({filter: gameCheck})
        const heart = msg.createReactionCollector({filter: heartCheck})
        const booru = msg.createReactionCollector({filter: booruCheck})
        const info = msg.createReactionCollector({filter: infoCheck})
        const japanese = msg.createReactionCollector({filter: japaneseCheck})
        const level = msg.createReactionCollector({filter: levelCheck})
        const image = msg.createReactionCollector({filter: imageCheck})
        const misc = msg.createReactionCollector({filter: miscCheck})
        const miscTwo = msg.createReactionCollector({filter: miscTwoCheck})
        const mod = msg.createReactionCollector({filter: modCheck})
        const music = msg.createReactionCollector({filter: musicCheck})
        const musicTwo = msg.createReactionCollector({filter: musicTwoCheck})
        const musicThree = msg.createReactionCollector({filter: musicThreeCheck})
        const reddit = msg.createReactionCollector({filter: redditCheck})
        const twitter = msg.createReactionCollector({filter: twitterCheck})
        const video = msg.createReactionCollector({filter: videoCheck})
        const waifu = msg.createReactionCollector({filter: waifuCheck})
        const web = msg.createReactionCollector({filter: webCheck})
        const webTwo = msg.createReactionCollector({filter: webTwoCheck})
        const webThree = msg.createReactionCollector({filter: webThreeCheck})
        const left = msg.createReactionCollector({filter: leftCheck})
        const right = msg.createReactionCollector({filter: rightCheck})
        const dm = msg.createReactionCollector({filter: dmCheck})

        const collectors = [admin, anime, booru, botDev, config, fun, game, heart, image, info, japanese, level, misc, miscTwo, mod, music, musicTwo, musicThree, reddit, twitter, video, waifu, web, webTwo, webThree]

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
                    if (Array.isArray(e)) return false
                    if (e.name === "arrowLeft" || e.name === "arrowRight") {
                        return false
                    } else {
                        return true
                    }
                }) as unknown as GuildEmoji[]
                const curr = filtered.findIndex((e) => e.name === reaction.emoji.name)
                page = i
                const embed = await this.updateEmbed(embeds, page, user, msg, true, curr, commandCount)
                if (embed) this.discord.edit(msg, embed)
                await reaction.users.remove(user).catch(() => null)
            })
        }

        right.on("collect", async (reaction: MessageReaction, user: User) => {
            if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to remove every reaction on this message. You can use \`help 2\` to send the second page in a new message. ${this.discord.getEmoji("kannaFacepalm")}`)
                setTimeout(() => rep.delete(), 5000)
                return
            }
            if (pageIndex === pages.length - 1) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex++
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
            if (pageIndex === pages.length - 1) await msg.react(this.discord.getEmoji("dm"))
        })

        left.on("collect", async (reaction: MessageReaction, user: User) => {
            if (!(msg.channel as TextChannel).permissionsFor(msg.guild?.members.me!)?.has("ManageMessages")) {
                const rep = await this.discord.send(msg, `<@${user.id}>, The bot needs the permission **Manage Messages** to remove every reaction on this message. You can use \`help\` to send the first page in a new message. ${this.discord.getEmoji("kannaFacepalm")}`)
                setTimeout(() => rep.delete())
                return
            }
            if (pageIndex === 0) return reaction.users.remove(user)
            await msg.reactions.removeAll()
            pageIndex--
            for (let i = 0; i < pages[pageIndex].length; i++) await msg.react(pages[pageIndex][i])
        })

        const dmSet = new Set()
        dm.on("collect", async (reaction: MessageReaction, user: User) => {
            await reaction.users.remove(user).catch(() => null)
            if (dmSet.has(user.id)) return
            const msg = this.message
            msg.author = user
            const cmd = new CommandFunctions(this.discord, msg)
            await cmd.runCommand(msg, ["help", "dm", "delete"])
            dmSet.add(user.id)
        })
    }

    // Create Prompt
    public createPrompt = (func: (message: Message<true>, collector: MessageCollector) => void, infinite?: boolean): Promise<void> => {
        const filter = (m: Message) => m.author!.id === this.message.author!.id && m.channel === this.message.channel
        const collector = this.message.channel.createMessageCollector({filter, time: infinite ? undefined : 120000})
        return new Promise((resolve) => {
            collector.on("collect", (m) => {
                func(m as Message<true>, collector)
                collector.stop()
            })

            collector.on("end", async (collector, reason) => {
                if (reason === "time") {
                    const time = await this.discord.reply(this.message, `Ended the prompt because you took too long to answer.`)
                    setTimeout(() => time.delete(), 600000)
                }
                resolve()
            })
        })
    }
}

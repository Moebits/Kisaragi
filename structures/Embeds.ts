import {Emoji, Message, MessageCollector, MessageEmbed, MessageEmbedThumbnail, MessageReaction, ReactionEmoji, User} from "discord.js"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi.js"
import {SQLQuery} from "./SQLQuery"

export class Embeds {
    private readonly functions = new Functions(this.message)
    private readonly sql = new SQLQuery(this.message)
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}

    // Create Embed
    public createEmbed = () => {
        const embed = new MessageEmbed()
        embed
            .setColor(Functions.randomColor())
            .setTimestamp(embed.timestamp!)
            .setFooter(`Responded in ${this.functions.responseTime()}`, this.message.author!.displayAvatarURL({format: "png", dynamic: true}))
        return embed
    }

    // Create Reaction Embed
    public createReactionEmbed = (embeds: MessageEmbed[], collapseOn?: boolean, startPage?: number) => {
        let page = 0
        if (startPage) page = startPage
        for (let i = 0; i < embeds.length; i++) {
            embeds[i].setFooter(`Page ${i + 1}/${embeds.length}`, this.message.author!.displayAvatarURL({format: "png", dynamic: true}))
        }
        const reactions: Emoji[] = [this.discord.getEmoji("right"), this.discord.getEmoji("left"), this.discord.getEmoji("tripleRight"), this.discord.getEmoji("tripleLeft"), this.discord.getEmoji("numberSelect")]
        const reactionsCollapse: Emoji[] = [this.discord.getEmoji("collapse"), this.discord.getEmoji("expand")]
        this.message.channel.send(embeds[page]).then(async (msg: Message) => {
            for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i] as ReactionEmoji)
            await this.sql.insertInto("collectors", "message", msg.id)
            await this.sql.updateColumn("collectors", "embeds", embeds, "message", msg.id)
            await this.sql.updateColumn("collectors", "collapse", collapseOn, "message", msg.id)
            await this.sql.updateColumn("collectors", "page", page, "message", msg.id)

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

            if (collapseOn) {
                const description: string[] = []
                const thumbnail: MessageEmbedThumbnail[] = []
                for (let i = 0; i < embeds.length; i++) {
                    description.push(embeds[i].description)
                    thumbnail.push((embeds[i].thumbnail!))
                }
                for (let i = 0; i < reactionsCollapse.length; i++) await msg.react(reactionsCollapse[i] as ReactionEmoji)
                const collapseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("collapse") && user.bot === false
                const expandCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("expand") && user.bot === false
                const collapse = msg.createReactionCollector(collapseCheck)
                const expand = msg.createReactionCollector(expandCheck)

                collapse.on("collect", (reaction: MessageReaction, user: User) => {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription("")
                            embeds[i].setThumbnail("")
                        }
                        embeds[page].setFooter(`Page ${page}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
                        msg.edit(embeds[page])
                        reaction.users.remove(user)
                })

                expand.on("collect", (reaction: MessageReaction, user: User) => {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i].url)
                    }
                    embeds[page].setFooter(`Page ${page}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
                    msg.edit(embeds[page])
                    reaction.users.remove(user)
                })
            }

            backward.on("collect", async (reaction: MessageReaction, user: User) => {
                if (page === 0) {
                    page = embeds.length - 1
                } else {
                    page--
                }
                await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                embeds[page].setFooter(`Page ${page}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
                msg.edit(embeds[page])
                await reaction.users.remove(user)
            })

            forward.on("collect", async (reaction: MessageReaction, user: User) => {
                if (page === embeds.length - 1) {
                    page = 0
                } else {
                    page++
                }
                await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                embeds[page].setFooter(`Page ${page}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
                msg.edit(embeds[page])
                reaction.users.remove(user)
            })

            tripleBackward.on("collect", async (reaction: MessageReaction, user: User) => {
                if (page === 0) {
                    page = (embeds.length - 1) - Math.floor(embeds.length/5)
                } else {
                    page -= Math.floor(embeds.length/5)
                }
                if (page < 0) page *= -1
                await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                embeds[page].setFooter(`Page ${page}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
                msg.edit(embeds[page])
                reaction.users.remove(user)
            })

            tripleForward.on("collect", async (reaction: MessageReaction, user: User) => {
                if (page === embeds.length - 1) {
                    page = 0 + Math.floor(embeds.length/5)
                } else {
                    page += Math.floor(embeds.length/5)
                }
                if (page > embeds.length - 1) page -= embeds.length - 1
                await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                embeds[page].setFooter(`Page ${page}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
                msg.edit(embeds[page])
                reaction.users.remove(user)
            })

            numberSelect.on("collect", async (reaction: MessageReaction, user: User) => {
                async function getPageNumber(response: Message) {
                    if (Number.isNaN(Number(response.content))) {
                        const rep = await response.reply("That page number is invalid.")
                        await rep.delete({timeout: 2000})
                    } else {
                        page = Number(response.content) - 1
                        embeds[page].setFooter(`Page ${page}/${embeds.length}`, user.displayAvatarURL({format: "png", dynamic: true}))
                        msg.edit(embeds[Number(response.content) - 1])
                    }
                    await response.delete()
                }
                const numReply = await msg.channel.send(`<@${user.id}>, Enter the page number to jump to.`)
                reaction.users.remove(user)
                await this.createPrompt(getPageNumber)
                await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                await numReply.delete()
            })
        })
    }

    // Re-trigger Existing Reaction Embed
    public editReactionCollector = async (msg: Message, emoji: string, embeds: MessageEmbed[], collapseOn?: boolean, startPage?: number) => {
        let page = 0
        if (startPage) page = startPage
        for (let i = 0; i < embeds.length; i++) {
            embeds[i].setFooter(`Page ${i + 1}/${embeds.length}`, this.message.author!.displayAvatarURL({format: "png", dynamic: true}))
        }
        const description: string[] = []
        const thumbnail: MessageEmbedThumbnail[] = []
        for (let i = 0; i < embeds.length; i++) {
                description.push(embeds[i].description)
                thumbnail.push(embeds[i].thumbnail!)
            }
        switch (emoji) {
            case "right":
                    if (page === embeds.length - 1) {
                        page = 0
                    } else {
                        page++
                    }
                    await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                    msg.edit(embeds[page])
                    break
            case "left":
                    if (page === 0) {
                        page = embeds.length - 1
                    } else {
                        page--
                    }
                    await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                    msg.edit(embeds[page])
                    break

            case "tripleRight":
                    if (page === embeds.length - 1) {
                        page = 0
                    } else {
                        page++
                    }
                    await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                    msg.edit(embeds[page])
                    break
            case "tripleLeft":
                    if (page === 0) {
                        page = (embeds.length - 1) - Math.floor(embeds.length/5)
                    } else {
                        page -= Math.floor(embeds.length/5)
                    }
                    if (page < 0) page *= -1
                    await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                    msg.edit(embeds[page])
                    break
            case "numberSelect":
                    async function getPageNumber(response: Message) {
                        if (Number.isNaN(Number(response.content))) {
                            const rep = await response.reply("That page number is invalid.")
                            await rep.delete({timeout: 2000})
                        } else {
                            page = Number(response.content) - 1
                            msg.edit(embeds[Number(response.content) - 1])
                        }
                        await response.delete()
                    }
                    const numReply = await msg.channel.send(`Enter the page number to jump to.`)
                    await this.createPrompt(getPageNumber)
                    await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
                    await numReply.delete()
                    break
            case "collapse":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("")
                        embeds[i].setThumbnail("")
                    }
                    msg.edit(embeds[page])
                    break
            case "expand":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i])
                        embeds[i].setThumbnail(thumbnail[i].url)
                    }
                    msg.edit(embeds[page])
            default:
        }

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

        if (collapseOn) {
            const collapseCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("collapse") && user.bot === false
            const expandCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("expand") && user.bot === false
            const collapse = msg.createReactionCollector(collapseCheck)
            const expand = msg.createReactionCollector(expandCheck)

            collapse.on("collect", (reaction: MessageReaction, user: User) => {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("")
                        embeds[i].setThumbnail("")
                    }
                    msg.edit(embeds[page])
                    reaction.users.remove(user)
            })

            expand.on("collect", (reaction: MessageReaction, user: User) => {
                for (let i = 0; i < embeds.length; i++) {
                    embeds[i].setDescription(description[i])
                    embeds[i].setThumbnail(thumbnail[i].url)
                }
                msg.edit(embeds[page])
                reaction.users.remove(user)
            })
        }

        backward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = embeds.length - 1
            } else {
                page--
            }
            await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
            msg.edit(embeds[page])
            reaction.users.remove(user)
        })

        forward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0
            } else {
                page++
            }
            await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
            msg.edit(embeds[page])
            reaction.users.remove(user)
        })

        tripleBackward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === 0) {
                page = (embeds.length - 1) - Math.floor(embeds.length/5)
            } else {
                page -= Math.floor(embeds.length/5)
            }
            if (page < 0) page *= -1
            await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
            msg.edit(embeds[page])
            reaction.users.remove(user)
        })

        tripleForward.on("collect", async (reaction: MessageReaction, user: User) => {
            if (page === embeds.length - 1) {
                page = 0 + Math.floor(embeds.length/5)
            } else {
                page += Math.floor(embeds.length/5)
            }
            if (page > embeds.length - 1) page -= embeds.length - 1
            await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
            msg.edit(embeds[page])
            reaction.users.remove(user)
        })

        numberSelect.on("collect", async (reaction: MessageReaction, user: User) => {
            async function getPageNumber(response: Message) {
                if (Number.isNaN(Number(response.content))) {
                    const rep = await response.reply("That page number is invalid.")
                    await rep.delete({timeout: 2000})
                } else {
                    page = Number(response.content) - 1
                    msg.edit(embeds[Number(response.content) - 1])
                }
                await response.delete()
            }
            const numReply = await msg.channel.send(`<@${user.id}>, Enter the page number to jump to.`)
            reaction.users.remove(user)
            await this.createPrompt(getPageNumber)
            await this.sql.updateColumn("collectors", "page", page, "message", msg.id)
            await numReply.delete()
        })
    }

    // Create Prompt
    public createPrompt = (func: (message: Message, collector: MessageCollector) => void): Promise<void> => {
        const filter = (m: Message) => m.author!.id === this.message.author!.id && m.channel === this.message.channel
        const collector = this.message.channel.createMessageCollector(filter, {time: 60000})
        return new Promise((resolve) => {
            collector.on("collect", (m: Message) => {
                func(m, collector)
                collector.stop()
            })

            collector.on("end", async (collector, reason) => {
                if (reason === "time") {
                    const time = await this.message.reply(`Ended the prompt because you took too long to answer.`)
                    time.delete({timeout: 10000})
                }
                resolve()
            })
        })
    }
}

import {Guild, Message, TextChannel} from "discord.js"
import * as config from "../config.json"
import {CommandFunctions} from "./../structures/CommandFunctions"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildCreate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (guild: Guild) => {
        const discord = this.discord
        const message = await this.discord.fetchFirstMessage(guild) as Message
        if (!message && guild.id !== "264445053596991498") {
            const chan = guild.channels.cache.find(((c) => c.permissionsFor(guild.me!)?.has("SEND_MESSAGES") ?? false))
            if (chan) await (chan as TextChannel).send(`The permissions **View Channel** and **Read Message History** are required. Reinvite the bot with sufficient permissions ${discord.getEmoji("kannaFacepalm")}`)
            await guild.leave()
            return
        }
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)

        const mainChannels = guild.channels.cache.filter((c) => {
            if (c.name.toLowerCase().includes("main") || c.name.toLowerCase().includes("general") || c.name.toLowerCase().includes("chat")) {
                if (c.type === "text") {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        }).map((c) => c) as TextChannel[]
        let index = 0
        let highest = mainChannels[0]?.rawPosition
        for (let i = 0; i < mainChannels.length; i++) {
            if (mainChannels[i]?.rawPosition < highest) {
                highest = mainChannels[i].rawPosition
                index = i
            }
        }
        let mainChannel = mainChannels[index]
        if (!mainChannel) mainChannel = await discord.fetchFirstMessage(guild).then((m) => m?.channel) as TextChannel

        if (!discord.checkMuted(message)) {
            const bots = guild.members.cache.filter((m) => m.user.bot).size
            if (guild.memberCount >= 10 && Math.floor(bots/guild.memberCount*1.0)*100 > 70) {
                await guild.leave()
                return
            }
        }

        SQLQuery.initGuild(message, true)

        try {
            let botRole = guild.roles.cache.find((r) => r.name.toLowerCase().includes("kisaragi"))
            if (!botRole) botRole = await guild.roles.create({data: {name: "✨ Kisaragi ✨", color: "#ff58f4"}})
            await guild.me?.roles.add(botRole)
        } catch {
            // Do nothing
        }

        const logGuild = async (guild: Guild) => {
            const guildChannel = discord.channels.cache.get(config.guildLog) as TextChannel
            const logEmbed = embeds.createEmbed()
            logEmbed
            .setAuthor("guild join", "https://discordemoji.com/assets/emoji/8994_TohruThumbsUp.gif")
            .setTitle(`**Joined a new guild!** ${discord.getEmoji("MeimeiYay")}`)
            .setThumbnail(guild.iconURL() ? guild.iconURL({format: "png", dynamic: true})! : "")
            .setImage(guild.bannerURL() ? guild.bannerURL({format: "png"})! : (guild.splashURL() ? guild.splashURL({format: "png"})! : ""))
            .setDescription(
                `${discord.getEmoji("star")}_Guild Name:_ **${guild.name}**\n` +
                `${discord.getEmoji("star")}_Guild Owner:_ **${guild.owner?.user.tag}**\n` +
                `${discord.getEmoji("star")}_Guild ID:_ \`${guild.id}\`\n` +
                `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(guild.createdAt)}**\n` +
                `${discord.getEmoji("star")}_Members:_ **${guild.memberCount}**\n`
            )
            guildChannel.send(logEmbed)
            return
        }
        if (config.testing === "off") logGuild(guild)

        const joinMessage = async () => {
            const msg = mainChannel.lastMessage
            if (msg) {
                await cmd.runCommand(msg, ["gettingstarted"])
            } else {
                await cmd.runCommand(message, ["gettingstarted", mainChannel.id])
            }
        }
        if (!discord.checkMuted(message)) joinMessage()

        const blacklistLeave = async (guild: Guild) => {
            const blacklists = await SQLQuery.selectColumn("blacklist", "guild id")
            const found = blacklists.find((g) => String(g) === guild.id)
            if (found) {
                await guild.leave()
            } else {
                const userLists = await SQLQuery.selectColumn("blacklist", "user id")
                const found = userLists.find((u) => String(u) === guild.ownerID)
                if (found) await guild.leave()
            }
        }
        blacklistLeave(guild)
    }
}

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
        const star = discord.getEmoji("star")
        const embeds = new Embeds(discord, message)
        const cmd = new CommandFunctions(discord, message)
        const sql = new SQLQuery(message)

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

        if (guild.id !== "333949691962195969") {
            if (!guild.me?.hasPermission(["MANAGE_MESSAGES", "SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS", "ATTACH_FILES", "USE_EXTERNAL_EMOJIS", "CONNECT", "SPEAK"])) {
                const chan = guild.channels.cache.find((c) => c.permissionsFor(guild.me!)?.has("SEND_MESSAGES") ?? false) as TextChannel
                await (chan ?? mainChannel).send(`The permissions **Manage Messages**, **Send Messages**, **Add Reactions**, **Embed Links**, **Attach Files**, **Use External Emojis**, **Connect**, and **Speak** are required. Invite the bot again with sufficient permissions.`)
                .catch(() => null)
                await guild.leave()
                return
            }
        }

        SQLQuery.initGuild(message)

        try {
            let botRole = guild.roles.cache.find((r) => r.name.toLowerCase().includes("kisaragi"))
            if (!botRole) botRole = await guild.roles.create({data: {name: "✨ Kisaragi ✨", color: "#ff58f4"}})
            await guild.me?.roles.add(botRole)
        } catch {
            // Do nothing
        }

        const logGuild = async (guild: Guild) => {
            const guildChannel = discord.channels.cache.get(config.guildLog) as TextChannel
            const invite = await discord.getInvite(guild)
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
                `${discord.getEmoji("star")}_Members:_ **${guild.memberCount}**\n` +
                `${discord.getEmoji("star")}_Invite:_ ${invite}`
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

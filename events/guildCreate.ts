import {Guild, Message, TextChannel} from "discord.js"
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
        sql.initGuild()

        const logGuild = async (guild: Guild) => {
            const guildChannel = discord.channels.cache.get("683760526840692761") as TextChannel
            const invite = await discord.getInvite(guild)
            const logEmbed = embeds.createEmbed()
            logEmbed
            .setAuthor("guild join", "https://discordemoji.com/assets/emoji/8994_TohruThumbsUp.gif")
            .setTitle(`**Joined a new guild!** ${discord.getEmoji("MeimeiYay")}`)
            .setThumbnail(guild.iconURL() ? guild.iconURL({format: "png", dynamic: true})! : "")
            .setImage(guild.bannerURL() ? guild.bannerURL({format: "png"})! : (guild.splashURL() ? guild.splashURL({format: "png"})! : ""))
            .setDescription(
                `${star}_Guild Name:_ **${guild.name}**\n` +
                `${star}_Guild Owner:_ **${guild.owner?.user.tag}**\n` +
                `${star}_Creation Date:_ **${Functions.formatDate(guild.createdAt)}**\n` +
                `${star}_Members:_ **${guild.memberCount}**\n` +
                `${star}_Invite:_ ${invite}`
            )
            guildChannel.send(logEmbed)
            return
        }
        logGuild(guild)

        const joinMessage = async (guild: Guild) => {
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
            const msg = mainChannel.lastMessage
            if (msg) {
                await cmd.runCommand(msg, ["gettingstarted"])
            } else {
                await cmd.runCommand(message, ["gettingstarted", mainChannel.id])
            }
        }
        joinMessage(guild)

        const blacklistLeave = async (guild: Guild) => {
            const blacklists = await sql.selectColumn("blacklist", "guild id")
            const found = blacklists.find((g) => String(g) === guild.id)
            if (found) {
                await guild.leave()
            } else {
                const userLists = await sql.selectColumn("blacklist", "user id")
                const found = userLists.find((u) => String(u) === guild.ownerID)
                if (found) await guild.leave()
            }
        }
        blacklistLeave(guild)
    }
}

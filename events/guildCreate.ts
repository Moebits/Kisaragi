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

        async function logGuild(guild: Guild) {
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
        // logGuild(guild)

        async function joinMessage(guild: Guild) {
            let mainChannel = guild.channels.cache.find((c) => c.name.toLowerCase().includes("main") || c.name.toLowerCase().includes("general") || c.name.toLowerCase().includes("chat")) as TextChannel
            if (!mainChannel) mainChannel = await discord.fetchFirstMessage(guild).then((m) => m?.channel) as TextChannel
            const msg = mainChannel.lastMessage
            if (msg) {
                await cmd.runCommand(msg, ["gettingstarted"])
            } else {
                await cmd.runCommand(message, ["gettingstarted", mainChannel.id])
            }
        }
        joinMessage(guild)
    }
}

import {Guild, Message, TextChannel} from "discord.js"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildDelete {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (guild: Guild) => {
        const discord = this.discord
        const message = await this.discord.fetchFirstMessage(guild) as Message
        const star = discord.getEmoji("star")
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        sql.deleteGuild(guild.id)

        async function logGuild(guild: Guild) {
            const guildChannel = discord.channels.cache.get("683760526840692761") as TextChannel
            const invite = await discord.getInvite(guild)
            const logEmbed = embeds.createEmbed()
            logEmbed
            .setAuthor("guild leave", "https://steamuserimages-a.akamaihd.net/ugc/956342034402318288/74A95F211FAF8ABF470C3F5716A1D6C1A90B0C9F/")
            .setTitle(`**Left guild!** ${discord.getEmoji("CirNo")}`)
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
    }
}

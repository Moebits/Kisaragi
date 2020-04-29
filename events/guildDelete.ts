import {Guild, Message, TextChannel} from "discord.js"
import * as config from "../config.json"
import {Embeds} from "./../structures/Embeds"
import {Functions} from "./../structures/Functions"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildDelete {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (guild: Guild) => {
        if (!guild.available) return
        const discord = this.discord
        const message = await this.discord.fetchFirstMessage(guild) as Message
        const star = discord.getEmoji("star")
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        SQLQuery.deleteGuild(guild.id)

        const logGuild = async (guild: Guild) => {
            const guildChannel = discord.channels.cache.get(config.guildLog) as TextChannel
            const invite = await discord.getInvite(guild)
            const logEmbed = embeds.createEmbed()
            logEmbed
            .setAuthor("guild leave", "https://steamuserimages-a.akamaihd.net/ugc/956342034402318288/74A95F211FAF8ABF470C3F5716A1D6C1A90B0C9F/")
            .setTitle(`**Left guild!** ${discord.getEmoji("CirNo")}`)
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
            await guildChannel.send(logEmbed)
            return
        }
        if (config.testing === "off") logGuild(guild)
    }
}

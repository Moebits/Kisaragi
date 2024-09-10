import {GuildMember, Message, Role, EmbedBuilder, AttachmentBuilder} from "discord.js"
import Sagiri from "sagiri"
import {Embeds} from "./Embeds"
import {Kisaragi} from "./Kisaragi"
import {SQLQuery} from "./SQLQuery"
import {animedetect} from "animedetect"

export class Detector {
    constructor(private readonly discord: Kisaragi, private readonly message: Message<true>) {}

    public detectIgnore = async () => {
        const sql = new SQLQuery(this.message)
        const ignored = await sql.fetchColumn("guilds", "ignored")
        if (!ignored) return false
        for (let i = 0; i < ignored.length; i++) {
            if (this.message.channel.id === ignored[i]) {
                return true
            }
        }
        return false
    }

    public detectAnime = async () => {
        const sql = new SQLQuery(this.message)
        const anime = await sql.fetchColumn("guilds", "anime") as unknown as string
        if (await this.detectIgnore()) return
        if (!anime || anime === "off") return
        if (this.message.author.id === this.discord.user!.id) return
        if (this.message.attachments.size) {
            const urls = this.message.attachments.map((a) => a.url)
            for (let i = 0; i < urls.length; i++) {
                const result = await animedetect(urls[i])
                if (!result) {
                    const reply = await this.discord.reply(this.message, "You can only post anime pictures!")
                    await this.message.delete()
                    setTimeout(() => reply.delete(), 10000)
                }
            }
        }
    }

    public swapRoles = async (member?: GuildMember, counter?: boolean) => {
        if (this.message.author.bot) return
        const sql = new SQLQuery(this.message)
        const pfp = await sql.fetchColumn("guilds", "pfp") as unknown as string
        if (!pfp || pfp === "off") return
        if (!member) member = this.message.member!
        if (!member || member.user.bot || !member.user.displayAvatarURL()) return
        const weeb = await sql.fetchColumn("guilds", "weeb") as unknown as string
        const normie = await sql.fetchColumn("guilds", "normie") as unknown as string
        const weebRole = this.message.guild!.roles.cache.find((r: Role) => r.id === weeb)
        const normieRole = this.message.guild!.roles.cache.find((r: Role) => r.id === normie)
        const result = await animedetect(member.user.displayAvatarURL({extension: "png"}))
        if (!result) {
            const found = member!.roles.cache.find((r: Role) => r === normieRole)
            if (found) {
                return
            } else {
                if (member!.roles.cache.find((r: Role) => r === weebRole)) {
                    await member!.roles.remove(weebRole!)
                }
                await member!.roles.add(normieRole!)
                if (counter) {
                    return false
                } else {
                    await this.discord.reply(this.message, `You were swapped to the <@&${normie}> role because you do not have an anime profile picture!`)
                }
            }
        } else {
            const found = member!.roles.cache.find((r: Role) => r === weebRole)
            if (found) {
                return
            } else {
                if (member!.roles.cache.find((r: Role) => r === normieRole)) {
                    await member!.roles.remove(normieRole!)
                }
                await member!.roles.add(weebRole!)
                if (counter) {
                    return true
                } else {
                    await this.discord.reply(this.message, `You were swapped to the <@&${weeb}> role because you have an anime profile picture!`)
                }
            }
        }
    }

    public sourceDetails = (source: any) => {
        let description = ""
        let url = ""
        switch (source.site) {
            case "Pixiv":
                const pixivArtist = source?.raw?.data?.member_name ? source?.raw?.data?.member_id ? `[${source?.raw?.data?.member_name}](https://www.pixiv.net/en/users/${source.raw.data.member_id})` : source?.raw?.data?.member_name : "Not found"
                description +=
                `Title: ${source?.raw?.data?.title ?? "Not found"} Artist: ${pixivArtist} Similarity: ${source.similarity}\n` +
                `Source: ${source?.raw?.data?.pixiv_id ? `https://www.pixiv.net/en/artworks/${source?.raw?.data?.pixiv_id}` : "Not found"}\n`
                url = `https://www.pixiv.net/en/artworks/${source?.raw?.data?.pixiv_id}`
                break
            default:
                const artist = source?.raw?.data?.member_name ? source.authorUrl ? `[${source?.raw?.data?.member_name}](${source.authorUrl})` : source?.raw?.data?.member_name : "Not found"
                description +=
                `Title: ${source?.raw?.data?.title ?? "Not found"} Artist: ${artist} Similarity: ${source.similarity}\n` +
                `Source: ${source?.raw?.data?.ext_urls ? source?.raw?.data?.ext_urls[0] : "Not found"}\n`
                url = source?.raw?.data?.ext_urls ? source?.raw?.data?.ext_urls[0] : ""
        }
        return description
    }

    public source = async () => {
        if (!this.message.attachments.size) return
        const sql = new SQLQuery(this.message)
        const embeds = new Embeds(this.discord, this.message)
        const channels = await sql.fetchColumn("guilds", "source")
        if (!channels?.includes(this.message.channel.id)) return
        const images = this.message.attachments.map((a) => a.url)
        const sagiri = Sagiri(process.env.SAUCENAO_API_KEY!)
        for (let i = 0; i < images.length; i++) {
            const source = await sagiri(images[i])
            const description = this.sourceDetails(source[0])
            const siteEmbed = embeds.createEmbed()
            siteEmbed
            .setDescription(description)
            this.discord.send(this.message, siteEmbed)
        }
    }
}

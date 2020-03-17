import axios from "axios"
import {GuildMember, Message, Role} from "discord.js"
import * as fs from "fs"
import * as config from "../config.json"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi.js"
import {SQLQuery} from "./SQLQuery"

const download = require("image-downloader")

export class Detector {
    private readonly openCVURL = `${config.openCVAPI}/animedetect?link=`
    constructor(private readonly discord: Kisaragi, private readonly message: Message) {}
    public detectIgnore = async () => {
        const sql = new SQLQuery(this.message)
        const ignored = await sql.fetchColumn("detection", "ignored")
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
        const anime = await sql.fetchColumn("detection", "pfp") as unknown as string
        if (await this.detectIgnore()) return
        if (!anime) return
        if (anime === "off") return
        if (this.message.author!.id === this.discord.user!.id) return
        if (this.message.attachments.size) {
            const urls = this.message.attachments.map((a) => a.url)
            for (let i = 0; i < urls.length; i++) {
                const data = await axios.get(`${this.openCVURL}${urls[i]}`).then((r) => r.data)
                if (!data.numDetections.join("")) {
                    const reply = await this.message.reply("You can only post anime pictures!")
                    await this.message.delete()
                    reply.delete({timeout: 10000})
                }
            }
        }
    }

    public swapRoles = async (member?: GuildMember, counter?: boolean) => {
        if (this.message.author!.bot) return
        const sql = new SQLQuery(this.message)
        const pfp = await sql.fetchColumn("detection", "pfp") as unknown as string
        if (!pfp || pfp === "off" || pfp[0] === "off") return
        if (!member) member = this.message.member!
        if (!member || member.user.bot || !member.user.displayAvatarURL()) return
        const weeb = await sql.fetchColumn("detection", "weeb") as unknown as string
        const normie = await sql.fetchColumn("detection", "normie") as unknown as string
        const weebRole = this.message.guild!.roles.cache.find((r: Role) => r.id === weeb)
        const normieRole = this.message.guild!.roles.cache.find((r: Role) => r.id === normie)
        const data = await axios.get(`${this.openCVURL}${member.user.displayAvatarURL({format: "png"})}`).then((r) => r.data)
        if (!data.numDetections.join("")) {
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
                    await this.message.reply(`You were swapped to the <@&${normie}> role because you do not have an anime profile picture!`)
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
                    await this.message.reply(`You were swapped to the <@&${weeb}> role because you have an anime profile picture!`)
                }
            }
        }
    }
}

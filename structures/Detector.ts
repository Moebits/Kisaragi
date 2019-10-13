import {GuildMember, Message, Role} from "discord.js"
import * as fs from "fs"
import gifFrames from "gif-frames"
import * as cv from "opencv4nodejs"
import {Functions} from "./Functions"
import {Kisaragi} from "./Kisaragi.js"
import {SQLQuery} from "./SQLQuery"

const classifier = new cv.CascadeClassifier("../assets/cascades/animeface.xml")
const download = require("image-downloader")

export class Detector {
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
                await download.image({url: urls[i], dest: `../assets/detection/image${i}.jpg`})
                const img = await cv.imreadAsync(`../assets/detection/image${i}.jpg`)
                const grayImg = await img.bgrToGrayAsync()
                const {numDetections} = await classifier.detectMultiScaleAsync(grayImg)
                if (!numDetections.join("")) {
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
        const weebRole = this.message.guild!.roles.find((r: Role) => r.id === weeb)
        const normieRole = this.message.guild!.roles.find((r: Role) => r.id === normie)
        if (member!.user.displayAvatarURL().slice(-3) === "gif") {
            gifFrames({url: member!.user.displayAvatarURL(), frames: 1}).then((frameData) => {
                frameData[0].getImage().pipe(fs.createWriteStream("../assets/detection/user.jpg"))
            })
            await Functions.timeout(1000)
        } else {
            await download.image({url: member!.user.displayAvatarURL(), dest: `../assets/detection/user.jpg`})
        }
        const img = await cv.imreadAsync(`../assets/detection/user.jpg`)
        const grayImg = await img.bgrToGrayAsync()
        const {numDetections} = await classifier.detectMultiScaleAsync(grayImg)
        if (!numDetections.join("")) {
            const found = member!.roles.find((r: Role) => r === normieRole)
            if (found) {
                return
            } else {
                if (member!.roles.find((r: Role) => r === weebRole)) {
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
            const found = member!.roles.find((r: Role) => r === weebRole)
            if (found) {
                return
            } else {
                if (member!.roles.find((r: Role) => r === normieRole)) {
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

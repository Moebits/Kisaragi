import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Detect extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures anime detection settings.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        if (!await perms.checkAdmin()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            detectPrompt(message)
            return
        }

        const links = await sql.fetchColumn("detection", "links")
        const anime = await sql.fetchColumn("detection", "anime")
        const pfp = await sql.fetchColumn("detection", "pfp")
        const weeb = await sql.fetchColumn("detection", "weeb")
        const normie = await sql.fetchColumn("detection", "normie")
        const detectEmbed = embeds.createEmbed()
        detectEmbed
        .setTitle(`**Detection Settings** ${discord.getEmoji("sagiriBleh")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(
            "Configure settings for automatic detection.\n" +
            "\n" +
            "**Link Detection** = Detects links and automatically runs the corresponding command.\n" +
            "**Anime Detection** = Removes all pictures that don't contain anime characters.\n" +
            "**Pfp Detection** = Actively swaps members between the weeb role (anime pfp) and normie role (non anime pfp).\n" +
            "\n" +
            "__Current Settings__\n" +
            `${star}Link detection is **${links ? links.join("") : "off"}**\n` +
            `${star}Anime detection is **${anime ? anime.join("") : "off"}**\n` +
            `${star}Pfp detection is **${pfp ? pfp.join("") : "off"}**\n` +
            `${star}Weeb role: **${weeb ? (weeb.join("") ? `<@&${weeb.join("")}>` : "None") : "None"}**\n` +
            `${star}Normie role: **${normie ? (normie.join("") ? `<@&${normie.join("")}>` : "None") : "None"}**\n` +
            "\n" +
            "__Edit Settings__\n" +
            `${star}Type **link** to toggle link detection on/off.\n` +
            `${star}Type **anime** to toggle anime detection on/off.\n` +
            `${star}Type **pfp** to toggle pfp detection on/off.\n` +
            `${star}**Mention a role or type a role id** to set the weeb role.\n` +
            `${star}Mention a role or type a role id **between brackets [role]** to set the normie role.\n` +
            `${star}You can set **multiple options at the same time**.\n` +
            `${star}Type **reset** to reset settings.\n` +
            `${star}Type **cancel** to exit.\n`
        )
        message.channel.send(detectEmbed)

        async function detectPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Detection Settings** ${discord.getEmoji("sagiriBleh")}`)
            const dLinks = await sql.fetchColumn("detection", "links")
            const dAnime = await sql.fetchColumn("detection", "anime")
            const dPfp = await sql.fetchColumn("detection", "pfp")
            const dWeeb = await sql.fetchColumn("detection", "weeb")
            const dNormie = await sql.fetchColumn("detection", "normie")
            let [setLink, setAnime, setPfp, setWeeb, setNormie] = [] as boolean[]

            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${star}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("detection", "links", "on")
                await sql.updateColumn("detection", "anime", "off")
                await sql.updateColumn("detection", "pfp", "off")
                await sql.updateColumn("detection", "weeb", null)
                await sql.updateColumn("detection", "normie", null)
                responseEmbed
                .setDescription(`${star}All settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }

            if (msg.content.match(/link/gi)) setLink = true
            if (msg.content.match(/anime/gi)) setAnime = true
            if (msg.content.match(/pfp/gi)) setPfp = true
            const newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "").replace(/\s+/g, "")
            const weebRole = newMsg.replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g)
            const normieRole = newMsg.match(/(?<=\[)(.*?)(?=\])/g)
            if (weebRole) setWeeb = true
            if (normieRole) setNormie = true

            let description = ""

            if (setLink) {
                if (!dLinks || dLinks.join("") === "off") {
                    await sql.updateColumn("detection", "links", "on")
                    description += `${star}Link detection is **on**!\n`
                } else {
                    await sql.updateColumn("detection", "links", "off")
                    description += `${star}Link detection is **off**!\n`
                }
            }

            if (setAnime) {
                if (!dAnime || dAnime.join("") === "off") {
                    await sql.updateColumn("detection", "anime", "on")
                    description += `${star}Anime detection is **on**!\n`
                } else {
                    await sql.updateColumn("detection", "anime", "off")
                    description += `${star}Anime detection is **off**!\n`
                }
            }

            if (setPfp) {
                if (!dPfp || dPfp.join("") === "off") {
                    if (!dWeeb.join("") || !dNormie.join("")) {
                        let [testWeeb, testNormie] = [] as boolean[]
                        if (!dWeeb.join("") && setWeeb) testWeeb = true
                        if (!dNormie.join("") && setNormie) testNormie = true
                        if (dWeeb.join("")) testWeeb = true
                        if (dNormie.join("")) testNormie = true
                        if (!(testWeeb && testNormie)) {
                            responseEmbed
                            .setDescription("In order to turn on pfp detection, you must set both the weeb and normie role.")
                            message.channel.send(responseEmbed)
                            return
                        }
                    }
                    await sql.updateColumn("detection", "pfp", "on")
                    description += `${star}Pfp detection is **on**!\n`
                } else {
                    await sql.updateColumn("detection", "pfp", "off")
                    description += `${star}Pfp detection is **off**!\n`
                }
            }

            if (setWeeb) {
                await sql.updateColumn("detection", "weeb", weebRole!.join(""))
                description += `${star}Weeb role set to **<@&${weebRole!.join("")}>**!\n`
            }

            if (setNormie) {
                await sql.updateColumn("detection", "normie", normieRole!.join(""))
                description += `${star}Normie role set to **<@&${normieRole!.join("")}>**!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }

        embeds.createPrompt(detectPrompt)
    }
}

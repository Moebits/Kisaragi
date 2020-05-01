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
            description: "Configures detection settings.",
            help:
            `
            \`detect\` - Shows the anime detection prompt.
            \`detect link\` - Detects links and runs a command on them, eg. youtube links
            \`detect anime\` - Removes pictures that don't contain anime characters
            \`detect pfp\` - Swaps members to a weeb (anime pfp) and normie (non anime pfp) role
            \`detect response\` - Toggles auto responses (eg. ayaya)
            \`detect reset\` - Resets settings to the default
            \`detect @role [@role]\` Sets the weeb role (@role) and normie role [@role]
            `,
            examples:
            `
            \`=>detect link anime pfp\`
            \`=>detect @role [@role]\`
            \`=>detect reset\`
            `,
            guildOnly: true,
            aliases: ["detection"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (!await perms.checkAdmin()) return
        const loading = message.channel.lastMessage
        loading?.delete()
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            await detectPrompt(message)
            return
        }

        const links = await sql.fetchColumn("detection", "links")
        const anime = await sql.fetchColumn("detection", "anime")
        const pfp = await sql.fetchColumn("detection", "pfp")
        const weeb = await sql.fetchColumn("detection", "weeb")
        const normie = await sql.fetchColumn("detection", "normie")
        const response = await sql.fetchColumn("detection", "response")
        const detectEmbed = embeds.createEmbed()
        detectEmbed
        .setTitle(`**Detection Settings** ${discord.getEmoji("sagiriBleh")}`)
        .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
        .setDescription(Functions.multiTrim(`
            Configure settings for automatic detection.
            newline
            **Link Detection** - Detects links and automatically runs the corresponding command.
            **Anime Detection** - Removes all pictures that don't contain anime characters.
            **Pfp Detection** - Actively swaps members between the weeb role (anime pfp) and normie role (non anime pfp).
            **Autoresponses** - Unprefixed words that the bot responds to
            newline
            __Current Settings__
            ${discord.getEmoji("star")}Link detection is **${links ? links :  "off"}**
            ${discord.getEmoji("star")}Anime detection is **${anime ? anime :  "off"}**
            ${discord.getEmoji("star")}Pfp detection is **${pfp ? pfp :  "off"}**
            ${discord.getEmoji("star")}Autoresponses are **${response ? response :  "off"}**
            ${discord.getEmoji("star")}Weeb role: **${weeb ? (weeb ?  `<@&${weeb}>` : "None") :  "None"}**
            ${discord.getEmoji("star")}Normie role: **${normie ? (normie ?  `<@&${normie}>` : "None") : "None"}**
            newline
            __Edit Settings__
            ${discord.getEmoji("star")}Type **link** to toggle link detection on/off.
            ${discord.getEmoji("star")}Type **anime** to toggle anime detection on/off.
            ${discord.getEmoji("star")}Type **pfp** to toggle pfp detection on/off.
            ${discord.getEmoji("star")}Type **response** to toggle auto responses on/off.
            ${discord.getEmoji("star")}**Mention a role or type a role id** to set the weeb role.
            ${discord.getEmoji("star")}Mention a role or type a role id **between brackets [role]** to set the normie role.
            ${discord.getEmoji("star")}You can set **multiple options at the same time**.
            ${discord.getEmoji("star")}Type **reset** to reset settings.
            ${discord.getEmoji("star")}Type **cancel** to exit.
        `))
        message.channel.send(detectEmbed)

        async function detectPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Detection Settings** ${discord.getEmoji("sagiriBleh")}`)
            let [setLink, setAnime, setPfp, setResponse, setWeeb, setNormie] = [] as boolean[]

            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("detection", "links", "on")
                await sql.updateColumn("detection", "anime", "off")
                await sql.updateColumn("detection", "pfp", "off")
                await sql.updateColumn("detection", "response", "off")
                await sql.updateColumn("detection", "weeb", null)
                await sql.updateColumn("detection", "normie", null)
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}All settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }

            if (msg.content.match(/link/gi)) setLink = true
            if (msg.content.match(/anime/gi)) setAnime = true
            if (msg.content.match(/pfp/gi)) setPfp = true
            if (msg.content.match(/response/gi)) setResponse = true
            const newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "").replace(/\s+/g, "")
            const weebRole = newMsg.replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g)
            const normieRole = newMsg.match(/(?<=\[)(.*?)(?=\])/g)
            if (weebRole) setWeeb = true
            if (normieRole) setNormie = true

            let description = ""

            if (setLink) {
                if (!links || links === "off") {
                    await sql.updateColumn("detection", "links", "on")
                    description += `${discord.getEmoji("star")}Link detection is **on**!\n`
                } else {
                    await sql.updateColumn("detection", "links", "off")
                    description += `${discord.getEmoji("star")}Link detection is **off**!\n`
                }
            }

            if (setAnime) {
                if (!anime || anime === "off") {
                    await sql.updateColumn("detection", "anime", "on")
                    description += `${discord.getEmoji("star")}Anime detection is **on**!\n`
                } else {
                    await sql.updateColumn("detection", "anime", "off")
                    description += `${discord.getEmoji("star")}Anime detection is **off**!\n`
                }
            }

            if (setResponse) {
                if (!response || response === "off") {
                    await sql.updateColumn("detection", "response", "on")
                    description += `${discord.getEmoji("star")}Auto responses are **on**!\n`
                } else {
                    await sql.updateColumn("detection", "response", "off")
                    description += `${discord.getEmoji("star")}Auto responses are **off**!\n`
                }
            }

            if (setPfp) {
                if (!pfp || pfp === "off") {
                    if (!weeb || !normie) {
                        let [testWeeb, testNormie] = [] as boolean[]
                        if (!weeb && setWeeb) testWeeb = true
                        if (!normie && setNormie) testNormie = true
                        if (weeb) testWeeb = true
                        if (normie) testNormie = true
                        if (!(testWeeb && testNormie)) {
                            responseEmbed
                            .setDescription("In order to turn on pfp detection, you must set both the weeb and normie role.")
                            message.channel.send(responseEmbed)
                            return
                        }
                    }
                    await sql.updateColumn("detection", "pfp", "on")
                    description += `${discord.getEmoji("star")}Pfp detection is **on**!\n`
                } else {
                    await sql.updateColumn("detection", "pfp", "off")
                    description += `${discord.getEmoji("star")}Pfp detection is **off**!\n`
                }
            }

            if (setWeeb) {
                await sql.updateColumn("detection", "weeb", String(weebRole))
                description += `${discord.getEmoji("star")}Weeb role set to **<@&${String(weebRole)}>**!\n`
            }

            if (setNormie) {
                await sql.updateColumn("detection", "normie", String(normieRole))
                description += `${discord.getEmoji("star")}Normie role set to **<@&${String(normieRole)}>**!\n`
            }

            responseEmbed
            .setDescription(description)
            return msg.channel.send(responseEmbed)
        }

        await embeds.createPrompt(detectPrompt)
    }
}

import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"

export default class LevelRoles extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures settings for level up roles.",
            help:
            `
            \`levelroles\` - Opens the levelroles prompt
            \`levelroles @role? points? msg?\` - Sets a new level up role.
            \`levelroles edit setting @role? points? msg?\` - Edits the level up role.
            \`levelroles delete setting\` - Deletes a level up role.
            \`levelroles reset\` - Deletes all level up roles.
            `,
            examples:
            `
            \`=>levelroles\`
            \`=>levelroles @senpai 10000\`
            \`=>levelroles @cute 5000 You are so cute!\`
            `,
            aliases: [],
            cooldown: 10,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const loading = message.channel.lastMessage
        loading?.delete()
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            // await levelPrompt(message)
            return
        }

        // {role: r, points: p, message: msg}
        /*
        const levelRoles = await sql.fetchColumn("points", "level roles")
        const levelEmbed = embeds.createEmbed()
        levelEmbed
        .setTitle(`**Point Settings** ${discord.getEmoji("mexShrug")}`)
        .setThumbnail(message.guild!.iconURL() as string)
        .setDescription(Functions.multiTrim(`
            Configure general point settings. To set level up roles, use **levelroles** instead. To toggle points on
            individual channels, use **levelchannels** instead.
            newline
            __Text Replacements:__
            **user** - user mention
            **tag** - user tag
            **name** - username
            **newlevel** - new level
            **totalpoints** - total points
            newline
            **Point Toggle** - Whether the point system is enabled or disabled.
            **Point Range** - The range of points to award per message.
            **Point Threshold** - The amount of points required to level up.
            **Point Timeout** - How often points are awarded (in seconds).
            newline
            __Current Settings:__
            ${discord.getEmoji("star")}_Point Toggle:_ **${pointToggle}**
            ${discord.getEmoji("star")}_Point Range:_ **${pointRange}**
            ${discord.getEmoji("star")}_Point Threshold:_ **${pointThreshold}**
            ${discord.getEmoji("star")}_Point Timeout:_ **${Math.floor(parseInt(pointTimeout, 10)/1000)}**
            ${discord.getEmoji("star")}_Level Message:_ **${levelMsg}**
            newline
            __Edit Settings:__
            ${discord.getEmoji("star")}_**Type any message** to set the level message._
            ${discord.getEmoji("star")}_Type **enable** or **disable** to enable or disable the point system._
            ${discord.getEmoji("star")}_Use brackets **[10, 20]** to set the point range._
            ${discord.getEmoji("star")}_Use braces **{1000}** to set the point threshold._
            ${discord.getEmoji("star")}_Use angle brackets **<60>** to set the point timeout._
            ${discord.getEmoji("star")}_**You can type multiple options** to enable all at once._
            ${discord.getEmoji("star")}_Type **destroy** to delete all the points of every member (no undo)._
            ${discord.getEmoji("star")}_Type **reset** to reset all settings, excluding member points._
            ${discord.getEmoji("star")}_Type **cancel** to exit._
        `))
        message.channel.send(levelEmbed)

        async function levelPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            responseEmbed.setTitle(`**Point Settings** ${discord.getEmoji("mexShrug")}`)
            let [setOn, setOff, setRange, setThreshold, setTimeout, setMsg] = [false, false, false, false, false, false]
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("points", "point range", [10, 20])
                await sql.updateColumn("points", "point threshold", 1000)
                await sql.updateColumn("points", "point timeout", 60000)
                await sql.updateColumn("points", "point toggle", "off")
                await sql.updateColumn("points", "level message", "Congrats user, you are now level newlevel!")
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Level settings were reset!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "destroy") {
                await sql.updateColumn("points", "scores", null)
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Points were destroyed for every member in the guild!`)
                msg.channel.send(responseEmbed)
                return
            }
            const newMsg = msg.content.replace(/enable/g, "").replace(/disable/g, "").replace(/\[(.*)\]/g, "")
            .replace(/<(.*)>/g, "").replace(/\{(.*)\}/g, "").replace(/\s/g, "")
            const newRange = msg.content.match(/\[(.*)\]/g)
            const newTimeout = msg.content.match(/<(.*)>/g)
            const newThreshold = msg.content.match(/\{(.*)\}/g)
            if (msg.content.match(/enable/g)) setOn = true
            if (msg.content.match(/disable/g)) setOff = true
            if (newRange) setRange = true
            if (newTimeout) setTimeout = true
            if (newThreshold) setThreshold = true
            if (newMsg) setMsg = true
            if (newMsg === "undefined") setMsg = false

            let description = ""

            if (setOn && setOff) {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`)
                return msg.channel.send(responseEmbed)
            }

            if (setMsg) {
                await sql.updateColumn("points", "level message", newMsg)
                description += `${discord.getEmoji("star")}Level message set to **${newMsg}**\n`
            }

            if (setOn) {
                await sql.updateColumn("points", "point toggle", "off")
                description += `${discord.getEmoji("star")}Leveling is now **enabled**!\n`
            }
            if (setOn) {
                await sql.updateColumn("points", "point toggle", "on")
                description += `${discord.getEmoji("star")}Leveling is now **disabled**!\n`
            }
            if (setRange) {
                await sql.updateColumn("points", "point range", newRange)
                description += `${discord.getEmoji("star")}Point range set to **${newRange}**!\n`
            }
            if (setThreshold) {
                await sql.updateColumn("points", "point range", String(newThreshold))
                description += `${discord.getEmoji("star")}Point threshold set to **${String(newThreshold).replace(/\{/g, "").replace(/\}/g, "")}**!\n`
            }
            if (setTimeout) {
                await sql.updateColumn("points", "point range", [Math.floor(parseInt(String(newTimeout).replace(/</g, "").replace(/>/g, ""), 10)*1000)])
                description += `${discord.getEmoji("star")}Point timeout set to **${String(newTimeout).replace(/</g, "").replace(/>/g, "")}**!\n`
            }

            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }*/

        // embeds.createPrompt(levelPrompt)
    }
}

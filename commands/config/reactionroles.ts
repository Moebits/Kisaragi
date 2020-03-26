import type {GuildEmoji, Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class ReactionRoles extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures reaction role settings (disabled).",
            aliases: [],
            guildOnly: true,
            cooldown: 3,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
        return message.reply("This command is disabled for the time being...")
        if (!await perms.checkMod()) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            reactPrompt(message)
            return
        }

        /*
        {"message": messageID, "emoji": "emojiName", "role": roleID}
        */

        let messages = await sql.fetchColumn("reaction", "message")
        let emojis = await sql.fetchColumn("reaction", "emoji")
        let roles = await sql.fetchColumn("reaction", "role")
        let states = await sql.fetchColumn("reaction", "state")
        messages = JSON.parse(messages)
        emojis = JSON.parse(emojis)
        roles = JSON.parse(roles)
        states = JSON.parse(states)
        const step = 3.0
        const increment = Math.ceil((messages[0] ? messages.length : 1) / step)
        const reactArray: MessageEmbed[] = []
        for (let i = 0; i < increment; i++) {
            let settings = ""
            for (let j = 0; j < step; j++) {
                if (messages[0] || emojis[0] || roles[0] || states[0]) {
                    const value = (i*step)+j
                    if (!messages.join("") || !emojis[0] || !roles[0] || !states[0]) settings = "None"
                    if (!messages[value]) break
                    const foundMsg = await discord.fetchMessage(message, messages[value])
                    const guildEmoji = message.guild!.emojis.cache.find((e: GuildEmoji) => {
                        const found = (e.name.toLowerCase().includes(emojis[value].toLowerCase())) ? true : false
                        return found
                    })
                    const identifier = guildEmoji!.identifier
                    settings += `${i + 1} **=>**\n` +
                    `${discord.getEmoji("star")}_Message:_ [Link](${foundMsg!.url})\n` +
                    `${discord.getEmoji("star")}_Emoji:_ ${identifier}\n` +
                    `${discord.getEmoji("star")}_Role:_ <@&${roles[value]}>\n`
                } else {
                    settings = "None"
                }
            }
            const reactEmbed = embeds.createEmbed()
            reactEmbed
            .setTitle(`**Reaction Roles** ${discord.getEmoji("aquaUp")}`)
            .setThumbnail(message.guild!.iconURL({format: "png", dynamic: true})!)
            .setDescription(Functions.multiTrim(`
                Add and remove reaction roles.
                newline
                __Current Settings__
                ${settings}
                newline
                __Edit Settings__
                ${discord.getEmoji("star")}Type a **message id** to set the message.
                ${discord.getEmoji("star")}**Mention a role or type a role id** to set the role.
                ${discord.getEmoji("star")}**Type an emoji or emoji name** to set the emoji.
                ${discord.getEmoji("star")}Type **delete (setting number)** to delete a setting.
                ${discord.getEmoji("star")}Type **edit (setting number)** to edit a setting.
                ${discord.getEmoji("star")}Type **toggle (setting number)** to toggle the state.
                ${discord.getEmoji("star")}Type **reset** to delete all settings.
                ${discord.getEmoji("star")}Type **cancel** to exit.
            `))
            reactArray.push(reactEmbed)
        }

        if (reactArray.length > 1) {
            embeds.createReactionEmbed(reactArray)
        } else {
            message.channel.send(reactArray[0])
        }

        async function reactPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()

            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("special roles", "reaction roles", null)
                responseEmbed
                .setDescription(`${discord.getEmoji("star")}Reaction role settings were wiped!`)
                msg.channel.send(responseEmbed)
                return
            }

        }

        embeds.createPrompt(reactPrompt)
    }
}

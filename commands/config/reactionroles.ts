import {GuildEmoji, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class ReactionRoles extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Configures reaction role settings.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
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
        messages = JSON.parse(messages[0])
        emojis = JSON.parse(emojis[0])
        roles = JSON.parse(roles[0])
        states = JSON.parse(states[0])
        const step = 3.0
        const increment = Math.ceil((messages[0] ? messages.length : 1) / step)
        const reactArray = []
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
            .setDescription(
                `Add and remove reaction roles.\n` +
                "\n" +
                "__Current Settings__\n" +
                settings + "\n" +
                "\n" +
                "__Edit Settings__\n" +
                `${discord.getEmoji("star")}Type a **message id** to set the message.\n` +
                `${discord.getEmoji("star")}**Mention a role or type a role id** to set the role.\n` +
                `${discord.getEmoji("star")}**Type an emoji or emoji name** to set the emoji.\n` +
                `${discord.getEmoji("star")}Type **delete (setting number)** to delete a setting.\n` +
                `${discord.getEmoji("star")}Type **edit (setting number)** to edit a setting.\n` +
                `${discord.getEmoji("star")}Type **toggle (setting number)** to toggle the state.\n` +
                `${discord.getEmoji("star")}Type **reset** to delete all settings.\n` +
                `${discord.getEmoji("star")}Type **cancel** to exit.\n`
            )
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

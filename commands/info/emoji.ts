import {GuildEmoji, ApplicationEmoji, Message, EmbedBuilder} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Emoji extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Posts the image of an emoji.",
            help:
            `
            \`emoji emoji/name\` - Posts an emoji from the emoji or name
            \`emoji dev emoji/name\` - Gets an emoji from servers the developer owns
            \`emoji list\` - Posts a list of all the emojis in the server
            `,
            examples:
            `
            \`=>emoji karenSugoi\`
            \`=>emoji kannaHungry\`
            \`=>emoji dev download\`
            \`=>emoji list\`
            `,
            aliases: [],
            cooldown: 5
        })
    }

    public getImage = (emoji: GuildEmoji | ApplicationEmoji) => {
        let image = ""
        if (emoji.animated) {
            image = `https://cdn.discordapp.com/emojis/${emoji.id}.gif`
        } else {
            image = `https://cdn.discordapp.com/emojis/${emoji.id}.png`
        }
        return image
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        if (args[1] === "list") {
            if (!message.guild) return message.reply(`This command can only be used in a guild.`)
            const emojis = message.guild?.emojis.cache.map((e)=> {
                if (e.animated) {
                    return `<${e.identifier}>`
                } else {
                    return `<:${e.identifier}>`
                }
            })!.join("")
            const split = Functions.splitMessage(emojis, {maxLength: 2000, char: "<"})
            const emojiArray: EmbedBuilder[] = []
            for (let i = 0; i < split.length; i++) {
                if (split.length > 1) split[i] = `<${split[i]}`
                const emojiEmbed = embeds.createEmbed()
                .setTitle(`**Emoji List** ${discord.getEmoji("kannaAngry")}`)
                .setDescription(split[i])
                emojiArray.push(emojiEmbed)
            }
            if (emojiArray.length === 1) {
                return message.channel.send({embeds: [emojiArray[0]]})
            } else {
                return embeds.createReactionEmbed(emojiArray)
            }
        }

        const emojiEmbed = embeds.createEmbed()
        .setTitle(`**Emoji Search** ${discord.getEmoji("gabStare")}`)
        const emojiName = args[1]
        if (!emojiName) return this.noQuery(emojiEmbed, "You must provide an emoji or emoji name.")

        const emojiID = String(emojiName.replace(/(?<=:)(.*?)(?=:)/g, "").match(/\d+/))

        if (emojiID === "null") {
            let emojiFound: GuildEmoji | ApplicationEmoji | undefined
            if (args[1] === "dev") {
                emojiFound = discord.getEmoji(args[2])
            } else  {
                emojiFound = discord.emojis.cache.find((emoji: GuildEmoji) => emoji.name?.toLowerCase() === emojiName.toLowerCase())
            }
            if (!emojiFound) {
                message.channel.send({embeds: [emojiEmbed
                .setDescription("Could not find that emoji!")]})
                return
            }

            message.channel.send({embeds: [emojiEmbed
            .setDescription(`**${emojiFound.name} Emoji**`)
            .setImage(this.getImage(emojiFound))]})
            return

            } else {
                const emojiGet = discord.emojis.cache.get(emojiID)
                if (!emojiGet) return message.reply("Looks like this id is invalid...")
                message.channel.send({embeds: [emojiEmbed
                .setDescription(`**${emojiGet!.name} Emoji**`)
                .setImage(this.getImage(emojiGet))]})
                return
            }
    }
}

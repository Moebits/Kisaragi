import {Message, EmbedBuilder} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import kawaii from "../../assets/json/kawaii.json"

export default class Chibi extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts some chibi pictures.",
            help:
            `
            \`chibi\` - Sends some chibi
            `,
            examples:
            `
            \`=>chibi\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10,
            defer: true,
            subcommandEnabled: true
        })
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const imageArray: EmbedBuilder[] = []

        const links = Functions.shuffleArray(kawaii.chibi).slice(0, 20)
        for (let i = 0; i < links.length; i++) {
            await Functions.timeout(100)
            const imageEmbed = embeds.createEmbed()
            imageEmbed
            .setTitle(`**Chibi** ${discord.getEmoji("kannaBlushy")}`)
            .setURL(links[i])
            .setImage(links[i])
            imageArray.push(imageEmbed)
        }
        return embeds.createReactionEmbed(imageArray, false, true)
    }
}

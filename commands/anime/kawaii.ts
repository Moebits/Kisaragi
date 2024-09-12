import {Message, EmbedBuilder} from "discord.js"
import {SlashCommandSubcommand} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"
import kawaii from "../../assets/json/kawaii.json"

export default class Kawaii extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts some kawaii anime pictures.",
            help:
            `
            \`kawaii\` - Sends some kawaii pictures
            `,
            examples:
            `
            \`=>kawaii\`
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

        const links = Functions.shuffleArray(kawaii.kawaii).slice(0, 20)
        for (let i = 0; i < links.length; i++) {
            await Functions.timeout(100)
            const imageEmbed = embeds.createEmbed()
            imageEmbed
            .setTitle(`**Kawaii** ${discord.getEmoji("kannaBlushy")}`)
            .setURL(links[i])
            .setImage(links[i])
            imageArray.push(imageEmbed)
        }
        return embeds.createReactionEmbed(imageArray, false, true)
    }
}

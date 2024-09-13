import axios from "axios"
import {Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Discordjs extends Command {
    private src = null as any
    private search = null as any
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches the discord.js docs.",
            help:
            `
            \`discordjs query\` - Searches the docs for the query (master branch)
            \`discordjs master/stable/rpc/command/akairo/akairo-master/collection query\` - Searches the specified branch for the query
            \`discordjs url\` - Gets the resource from the url
            `,
            examples:
            `
            \`=>discordjs attachment\`
            \`=>discordjs stable message\`
            `,
            aliases: ["djs"],
            cooldown: 5,
            defer: true,
            subcommandEnabled: true
        })
        const queryOption = new SlashCommandOption()
            .setType("string")
            .setName("query")
            .setDescription("The query to search.")

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(queryOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
        const srcOptions = ["master", "stable", "rpc", "commando", "akairo", "akairo-master", "collection"]
        if (args[1]?.match(/discord.js.org/)) {
            this.src = args[1].match(/(?<=docs\/)(.*?)(?=\/)/)
            if (this.src === "main") this.src = args[1].match(/(?<=main\/)(.*?)(?=\/)/)
            this.search = args[1].match(/(?<=\/)(?:.(?!\/))+$/)?.[0].replace(/\?(?:.(?!\?))+$/, "")
        } else if (args[1]?.match(/discord-akairo.github.io/)) {
            this.src = args[1].match(/(?<=main\/)(.*?)(?=\/)/)
            if (this.src === "stable") this.src = "akairo"
            if (this.src === "master") this.src = "akairo-master"
            this.search = args[1].match(/(?<=\/)(?:.(?!\/))+$/)?.[0].replace(/\?(?:.(?!\?))+$/, "")
        }
        let src = ""
        let query = this.search || Functions.combineArgs(args, 2)
        if (srcOptions.includes(this.src || args[1])) {
                src = this.src || args[1]
        } else {
                src = "master"
                query = this.search || Functions.combineArgs(args, 1)
        }
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setTitle(`**Discord.js Docs** ${discord.getEmoji("gabStare")}`)
            .setAuthor({name:`discord.js`, iconURL: "https://avatars.githubusercontent.com/u/26492485?s=200&v=4", url: "https://discord.js.org/#/"}))
        }
        let result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=${src}&q=${query}`, {headers}).then((r) => r.data)
        if (result.title === "Search results:") {
            result = await axios.get(`https://djsdocs.sorta.moe/v2/embed?src=${src}&q=${result.description.match(/(?<=\[)(.*?)(?=\])/)[0].replace(/#/, ".")}`, {headers}).then((r) => r.data)
        }
        if (!result.fields) return message.reply("Nothing was found.")
        let fields = ""
        for (let i = 0; i < result.fields.length; i++) {
            if (result.fields[i].value.startsWith("[View source]")) {
                fields += `${result.fields[i].value.replace(/View source/, "**View Source**")}\n`
            } else {
                fields += `${discord.getEmoji("star")}_${result.fields[i].name}:_ ${result.fields[i].value}\n`
            }
        }
        const discordjsEmbed = embeds.createEmbed()
        discordjsEmbed
        .setTitle(`**${result.author.name}** ${discord.getEmoji("gabStare")}`)
        .setURL(result.url)
        .setThumbnail(message.author!.displayAvatarURL({extension: "png"}))
        .setAuthor({name:`discord.js`, iconURL: "https://avatars.githubusercontent.com/u/26492485?s=200&v=4", url: "https://discord.js.org/#/"})
        .setDescription(
        `${discord.getEmoji("star")}_Description:_ ${result.description.replace(/__/g, "**")}\n` +
        fields
        )
        this.reply(discordjsEmbed)
    }
}

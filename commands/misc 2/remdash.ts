import {GuildBasedChannel, Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Remdash extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Removes dashes from channel names.",
            help:
            `
            \`remdash\` - Removes dashes
            \`remdash add\` - Adds dashes
            `,
            examples:
            `
            \`=>remdash\`
            \`=>remdash add\`
            `,
            aliases: ["delhyphen"],
            guildOnly: true,
            cooldown: 5,
            subcommandEnabled: true
        })
        const addOption = new SlashCommandOption()
            .setType("string")
            .setName("add")
            .setDescription("Set to add to add dashes.")

        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(addOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const remEmbed = embeds.createEmbed()
        const nameArray = message.guild!.channels.cache.map((c: GuildBasedChannel) => c.name)
        const idArray = message.guild!.channels.cache.map((c: GuildBasedChannel) => c.id)
        if (args[1] === "add") {
            for (let i = 0; i < nameArray.length; i++) {
                if (nameArray[i].includes("﹒")) {
                    const newName = nameArray[i].replace(/﹒/g, "-")
                    const channel = message.guild!.channels.cache.find((c: GuildBasedChannel) => c.id === idArray[i])
                    await channel!.setName(newName)
                }
            }
            remEmbed
            .setTitle(`**Adddash** ${discord.getEmoji("kannaXD")}`)
            .setDescription("Added dashes to the channel names!")
            return this.reply(remEmbed)
        } else {
            for (let i = 0; i < nameArray.length; i++) {
                if (nameArray[i].includes("-")) {
                    const newName = nameArray[i].replace(/-/g, "﹒")
                    const channel = message.guild!.channels.cache.find((c: GuildBasedChannel) => c.id === idArray[i])
                    await channel!.setName(newName)
                }
            }
            remEmbed
            .setTitle(`**Remdash** ${discord.getEmoji("kannaXD")}`)
            .setDescription("Removed dashes from all channel names!")
            return this.reply(remEmbed)
        }
    }
}

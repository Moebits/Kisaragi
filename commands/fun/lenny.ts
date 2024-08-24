import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"

const lenny = require("lenny")

export default class Lenny extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts a lenny emoji.",
            help:
            `
            \`lenny\` - Posts a lenny emoji.
            \`lenny face/shrug/tableflip/unflip\` - Posts one of these popular faces.
            \`lenny query\` - Searches for a lenny emoji with the query.
            `,
            examples:
            `
            \`=>lenny\`
            \`=>lenny face\`
            \`=>lenny shrug\`
            `,
            aliases: [],
            random: "none",
            cooldown: 3,
            slashEnabled: true
        })
        const queryOption = new SlashCommandStringOption()
            .setName("query")
            .setDescription("Set to face/shrug/tableflip/unflip for the popular faces or search for something else.")
            
        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addStringOption(queryOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const message = this.message

        if (args[1] === "face") {
            message.reply("( ͡° ͜ʖ ͡°)")
        } else if (args[1] === "shrug") {
            message.reply("¯\\_(ツ)_/¯")
        } else if (args[1] === "tableflip") {
            message.reply("(╯°□°）╯︵ ┻━┻")
        } else if (args[1] === "unflip") {
            message.reply("┬─┬ ノ( ゜-゜ノ)")
        } else {
            message.reply(lenny())
        }
        return
    }
}

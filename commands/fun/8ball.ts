import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import {Command} from "../../structures/Command"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Eightball extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Responds to your question.",
            help:
            `
            \`8ball question\` - Answers your question.
            `,
            examples:
            `
            \`=>8ball do you love me?\`
            `,
            aliases: ["eightball"],
            cooldown: 3,
            slashEnabled: true
        })
        const questionOption = new SlashCommandStringOption()
            .setName("question")
            .setDescription("question")
            .setRequired(true)
            
        this.slash = new SlashCommandBuilder()
            .setName("8ball")
            .setDescription(this.options.description)
            .addStringOption(questionOption)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const responses = [
            `Uhh... maybe? ${discord.getEmoji("tohruThink")}`,
            `No ${discord.getEmoji("no")}`,
            `Yes ${discord.getEmoji("yes")}`,
            `That's a bit lewd ${discord.getEmoji("madokaLewd")}`,
            `I don't think that's a good idea ${discord.getEmoji("sagiriBleh")}`,
            `Sounds cool ${discord.getEmoji("aquaUp")}`,
            `That's a little much ${discord.getEmoji("kaosWTF")}`,
            `What was that ${discord.getEmoji("kannaCurious")}`,
            `Ehh... why not ${discord.getEmoji("mexShrug")}`,
            `Do what you want ${discord.getEmoji("raphi")}`,
            `Sure ${discord.getEmoji("gabYes")}`,
            `Hell no ${discord.getEmoji("kannaFU")}`,
            `Seriously ${discord.getEmoji("vigneDead")}`,
            `The loli police is out to get you ${discord.getEmoji("kannaFreeze")}`,
            `I won't answer that ${discord.getEmoji("gabuChrist")}`,
            `Well go ahead ${discord.getEmoji("smolMiku")}`
        ]

        const msg = Functions.combineArgs(args, 1).trim()
        if (!msg) return message.reply(`Umm... what are you asking ${discord.getEmoji("kannaFacepalm")}`)
        return message.reply(responses[Math.floor(Math.random()*responses.length)])
    }
}

import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const {CollegiateDictionary} = require("mw-dict")

export default class Define extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Retrieves the definition of a word from merriam webster.",
            help:
            `
            \`define word\` - Gets the definition of the word
            `,
            examples:
            `
            \`=>define energy\`
            `,
            aliases: ["def", "definition", "word", "dictionary"],
            random: "string",
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const dictionary = new CollegiateDictionary(process.env.DICTIONARY_API_KEY)
        let word = Functions.combineArgs(args, 1)
        if (!word) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
            .setTitle(`**Dictionary** ${discord.getEmoji("raphi")}`))
        }

        if (word.match(/merriam-webster.com/)) {
            word = word.replace("https://www.merriam-webster.com/dictionary/", "").replace(/%20/g, " ")
        }
        const defineEmbed = embeds.createEmbed()
        let result
        try {
            result = await dictionary.lookup(word.trim())
        } catch (error) {
            defineEmbed
            .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
            .setTitle(`**Dictionary** ${discord.getEmoji("raphi")}`)
            .setDescription(`No definitions were found. Here are some word suggestions: \n${error.suggestions.join(", ")}`)
            message.channel.send(defineEmbed)
            return
        }
        const definArray: string[] = []
        const exampleArray: string[] = []
        for (const i in result[0].definition) {
            if (result[0].definition[i].senses) {
                const meaningArray: string[] = []
                if (result[0].definition[i].senses.join("")) {
                    for (const j in result[0].definition[i].senses[0].meanings) {
                        if (result[0].definition[i].senses[0].meanings[j] === ":") {
                            if (result[0].definition[i].senses[0].synonyms) {
                                meaningArray.push(result[0].definition[i].senses[0].synonyms.join(" "))
                            } else {
                                meaningArray.push("")
                            }
                        } else {
                            meaningArray.push(result[0].definition[i].senses[0].meanings[j])
                        }
                    }
                    definArray.push(meaningArray.join("\n"))
                    exampleArray.push(result[0].definition[i].senses[0].illustrations ? result[0].definition[i].senses[0].illustrations[0] : "")
                } else {
                    definArray.push(result[0].definition[i].meanings.join("\n"))
                }
            } else {
                if (result[0].definition[i].meanings.join("").trim() === ":") {
                    definArray.push("")
                } else {
                    definArray.push(result[0].definition[i].meanings.join("\n"))
                }
                exampleArray.push(result[0].definition[i].illustrations ? result[0].definition[i].illustrations[0] : "")
            }
        }
        let definitions = ""
        for (let i = 0; i < definArray.length; i++) {
            if (definArray[i]) {
                definitions += `${discord.getEmoji("star")}_Definition:_ ${definArray[i]}\n`
            }
            if (exampleArray[i]) {
                definitions += `${discord.getEmoji("star")}_Example:_ ${exampleArray[i]}\n`
            }
        }
        defineEmbed
        .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
        .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
        .setURL(`https://www.merriam-webster.com/dictionary/${result[0].word.replace(/ /g, "_")}`)
        .setThumbnail(message.author!.displayAvatarURL({format: "png", dynamic: true}))
        .setDescription(
            `${discord.getEmoji("star")}_Word:_ **${result[0].word}**\n` +
            `${discord.getEmoji("star")}_Function:_ **${result[0].functional_label}**\n` +
            `${discord.getEmoji("star")}_Popularity:_ **${result[0].popularity}**\n` +
            `${discord.getEmoji("star")}_Etymology:_ ${result[0].etymology ? result[0].etymology : "None"}\n` +
            `${Functions.checkChar(definitions, 2000, ".")}\n`
        )
        message.channel.send(defineEmbed)
    }
}

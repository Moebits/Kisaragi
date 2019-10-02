import {Message} from "discord.js"
import {CollegiateDictionary} from "mw-dict"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Define extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        const dictionary = new CollegiateDictionary(process.env.DICTIONARY_API_KEY)
        const word = Functions.combineArgs(args, 1)
        const defineEmbed = embeds.createEmbed()
        let result
        try {
            result = await dictionary.lookup(word.trim())
        } catch (error) {
            defineEmbed
            .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
            .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
            .setDescription(`No definitions were found. Here are some word suggestions: \n${error.suggestions.join(", ")}`)
            message.channel.send(defineEmbed)
            return
        }
        const definArray: any = []
        const exampleArray: any = []
        for (const i in result[0].definition) {
            if (result[0].definition[i].senses) {
                const meaningArray: any = []
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
        for (const i in definArray) {
            if (definArray[i]) {
                definitions += `${star}_Definition:_ ${definArray[i]}\n`
            }
            if (exampleArray[i]) {
                definitions += `${star}_Example:_ ${exampleArray[i]}\n`
            }
        }
        defineEmbed
        .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
        .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
        .setURL(`https://www.merriam-webster.com/dictionary/${result[0].word.replace(/ /g, "_")}`)
        .setThumbnail(message.author!.displayAvatarURL())
        .setDescription(
            `${star}_Word:_ **${result[0].word}**\n` +
            `${star}_Function:_ **${result[0].functional_label}**\n` +
            `${star}_Popularity:_ **${result[0].popularity}**\n` +
            `${star}_Etymology:_ ${result[0].etymology ? result[0].etymology : "None"}\n` +
            `${Functions.checkChar(definitions, 2000, ".")}\n`
        )
        message.channel.send(defineEmbed)
    }
}

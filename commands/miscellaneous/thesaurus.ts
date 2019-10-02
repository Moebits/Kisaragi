import {Message} from "discord.js"
import {CollegiateThesaurus} from "mw-dict"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Thesaurus extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const thesaurus = new CollegiateThesaurus(process.env.THESAURUS_API_KEY)
        const word = Functions.combineArgs(args, 1)
        const thesaurusEmbed = embeds.createEmbed()
        let result
        try {
            result = await thesaurus.lookup(word.trim())
        } catch (error) {
            thesaurusEmbed
            .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
            .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
            .setDescription(`No synonyms were found. Here are some word suggestions: \n${error.suggestions.join(", ")}`)
            message.channel.send(thesaurusEmbed)
            return
        }

        const meaningArray: any = []
        const exampleArray: any = []
        const synonymArray: any = []
        const antonymArray: any = []
        for (const i in result[0].definition) {
            meaningArray.push(result[0].definition[i].meanings[0])
            if (result[0].definition[i].illustrations) {
                exampleArray.push(result[0].definition[i].illustrations[0])
            } else {
                exampleArray.push("")
            }
            synonymArray.push(result[0].definition[i].synonyms.join(", "))
            if (result[0].definition[i].antonyms) {
                exampleArray.push(result[0].definition[i].antonyms.join(", "))
            } else {
                antonymArray.push("")
            }
        }

        let synonyms = ""
        for (const i in meaningArray) {
            synonyms += `${discord.getEmoji("star")}_Meaning:_ ${meaningArray[i]}\n`
            if (exampleArray[i]) {
                synonyms += `${discord.getEmoji("star")}_Example:_ ${exampleArray[i]}\n`
            }
            synonyms += `${discord.getEmoji("star")}_Synonyms:_ ${synonymArray[i]}\n`
            if (antonymArray[i]) {
                synonyms += `${discord.getEmoji("star")}_Antonyms:_ ${antonymArray[i]}\n`
            }
        }

        thesaurusEmbed
        .setAuthor("merriam webster", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Merriam-Webster_logo.svg/1200px-Merriam-Webster_logo.svg.png")
        .setTitle(`**Word Lookup** ${discord.getEmoji("raphi")}`)
        .setURL(`https://www.merriam-webster.com/thesaurus/${result[0].word.replace(/ /g, "_")}`)
        .setThumbnail(message.author!.displayAvatarURL())
        .setDescription(
            `${discord.getEmoji("star")}_Word:_ **${result[0].word}**\n` +
            `${discord.getEmoji("star")}_Function:_ **${result[0].functional_label}**\n` +
            `${discord.getEmoji("star")}_Popularity:_ **${result[0].popularity}**\n` +
            `${Functions.checkChar(synonyms, 2000, ",")}\n`
        )
        message.channel.send(thesaurusEmbed)
    }
}

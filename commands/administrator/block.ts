import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {SQLQuery} from "../../structures/SQLQuery"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class Block extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permissions(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")
        if (await perms.checkAdmin(message)) return
        const input = Functions.combineArgs(args, 1)
        if (input.trim()) {
            message.content = input.trim()
            blockPrompt(message)
            return
        }
        const blockedWords = await sql.fetchColumn("blocks", "blocked words")
        const match = await sql.fetchColumn("blocks", "block match")
        const toggle = await sql.fetchColumn("blocks", "block toggle")
        const asterisk = await sql.fetchColumn("blocks", "asterisk")
        let wordList = ""
        if (blockedWords[0]) {
            for (let i = 0; i < blockedWords[0].length; i++) {
                wordList += `**${i + 1} - ${blockedWords[0][i]}**\n`
            }
        } else {
            wordList = "None"
        }
        const blockEmbed = embeds.createEmbed()
        blockEmbed
        .setTitle(`**Blocked Words** ${discord.getEmoji("gabuChrist")}`)
        .setThumbnail(message.guild!.iconURL() as string)
        .setDescription(
        "Add or remove blocked words.\n" +
        "\n" +
        "**Exact** = Only matches the exact word.\n" +
        "**Partial** = Also matches if the word is partially in another word.\n" +
        "**Asterisk Filtering** = Whether messages containing asterisks will be blocked.\n" +
        "\n" +
        "__Word List__\n" +
        wordList + "\n" +
        "\n" +
        "__Current Settings__" +
        `${star}_Filtering is **${toggle[0]}**._\n` +
        `${star}_Matching algorithm set to **${match[0]}**._\n` +
        `${star}_Asterisk filtering is **${asterisk[0]}**._\n` +
        "\n" +
        "__Edit Settings__" +
        "\n" +
        `${star}_**Type any words**, separated by a space, to add blocked words._\n` +
        `${star}_Type **enable** or **disable** to enable/disable filtering._\n` +
        `${star}_Type **exact** or **partial** to set the matching algorithm._\n` +
        `${star}_Type **asterisk** to toggle asterisk filtering._\n` +
        `${star}_Type **delete (word number)** to delete a word._\n` +
        `${star}_Type **reset** to delete all words._\n` +
        `${star}_Type **cancel** to exit._\n`
        )
        message.channel.send(blockEmbed)

        async function blockPrompt(msg: Message) {
            const responseEmbed = embeds.createEmbed()
            let words = await sql.fetchColumn("blocks", "blocked words")
            let [setOn, setOff, setExact, setPartial, setWord, setAsterisk] = [] as boolean[]
            if (msg.content.toLowerCase() === "cancel") {
                responseEmbed
                .setDescription(`${star}Canceled the prompt!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase() === "reset") {
                await sql.updateColumn("blocks", "blocked words", null)
                await sql.updateColumn("blocks", "asterisk", "off")
                responseEmbed
                .setDescription(`${star}All blocked words were deleted!`)
                msg.channel.send(responseEmbed)
                return
            }
            if (msg.content.toLowerCase().includes("delete")) {
                const num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""))
                if (num) {
                    if (words[0]) {
                        words[num - 1] = ""
                        words = words.filter(Boolean)
                        await sql.updateColumn("blocks", "blocked words", words)
                        responseEmbed
                        .setDescription(`${star}Setting ${num} was deleted!`)
                        msg.channel.send(responseEmbed)
                        return
                    }
                } else {
                    responseEmbed
                    .setDescription(`${star}Setting not found!`)
                    msg.channel.send(responseEmbed)
                    return
                }
            }

            const newMsg = msg.content.replace(/enable/gi, "").replace(/disable/gi, "").replace(/exact/gi, "").replace(/partial/gi, "")
            if (msg.content.match(/enable/gi)) setOn = true
            if (msg.content.match(/disable/gi)) setOff = true
            if (msg.content.match(/exact/gi)) setExact = true
            if (msg.content.match(/partial/gi)) setPartial = true
            if (msg.content.match(/asterisk/gi)) setAsterisk = true
            if (newMsg) setWord = true

            let wordArray = newMsg.split(" ")

            if (setOn && setOff) {
                responseEmbed
                    .setDescription(`${star}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed)
                return
            }

            if (setExact && setPartial) {
                responseEmbed
                    .setDescription(`${star}You can only choose one matching algorithm.`)
                msg.channel.send(responseEmbed)
                return
            }

            let description = ""

            if (words[0]) {
                for (let i = 0; i < words[0].length; i++) {
                    for (let j = 0; j < wordArray.length; j++) {
                        if (words[0][i] === wordArray[j]) {
                            description += `${star}**${wordArray[j]}** is already blocked!`
                            wordArray[j] = ""
                            wordArray = wordArray.filter(Boolean)
                        }
                    }
                }
            }

            if (setWord) {
                setOn = true
                await sql.updateColumn("blocks", "blocked words", wordArray)
                description += `${star}Added **${wordArray.join(", ")}**!\n`
            }
            if (setExact) {
                await sql.updateColumn("blocks", "block match", "exact")
                description += `${star}Matching algorithm set to **exact**!\n`
            }
            if (setPartial) {
                await sql.updateColumn("blocks", "block match", "partial")
                description += `${star}Matching algorithm set to **partial**!\n`
            }
            if (setOn) {
                await sql.updateColumn("blocks", "block toggle", "on")
                description += `${star}Filtering is **enabled**!\n`
            }
            if (setOff) {
                await sql.updateColumn("blocks", "block toggle", "off")
                description += `${star}Filtering is **disabled**!\n`
            }
            if (setAsterisk) {
                if (asterisk.join("") === "off") {
                    await sql.updateColumn("blocks", "asterisk", "on")
                    description += `${star}Asterisk filtering is **on**!\n`
                } else {
                    await sql.updateColumn("blocks", "asterisk", "off")
                    description += `${star}Asterisk filtering is **off**!\n`
                }
            }
            responseEmbed
            .setDescription(description)
            msg.channel.send(responseEmbed)
            return
        }
        embeds.createPrompt(blockPrompt)
        }
}

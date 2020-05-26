import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class ChuckNorris extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Fetches chuck norris jokes.",
            help:
            `
            \`chucknorris\` - Gets random jokes.
            \`chucknorris\` - Gets the joke from the id.
            `,
            examples:
            `
            \`=>chucknorris\`
            `,
            aliases: [],
            random: "none",
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        const headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}

        if (args[1]) {
            const joke = await axios.get(`http://api.icndb.com/jokes/${args[1]}`, {headers})
            if (!joke.data) {
                return this.invalidQuery(embeds.createEmbed()
                .setAuthor("chuck norris", "https://assets.chucknorris.host/img/avatar/chuck-norris.png")
                .setTitle(`**Chuck Norris Joke** ${discord.getEmoji("tohruSmug")}`))
            }
            const chuckEmbed = embeds.createEmbed()
            .setAuthor("chuck norris", "https://assets.chucknorris.host/img/avatar/chuck-norris.png")
            .setTitle(`**Chuck Norris Joke** ${discord.getEmoji("tohruSmug")}`)
            .setDescription(
            `${discord.getEmoji("star")}_ID:_ \`${joke.data.value.id}\`\n` +
            `${discord.getEmoji("star")}_Joke:_ ${joke.data.value.joke}\n`
            )
            return message.channel.send(chuckEmbed)
        }

        const jokes = await axios.get(`http://api.icndb.com/jokes/random/20`, {headers})
        const chuckArray: MessageEmbed[] = []
        for (let i = 0; i < jokes.data.value.length; i++) {
            const chuckEmbed = embeds.createEmbed()
            .setAuthor("chuck norris", "https://assets.chucknorris.host/img/avatar/chuck-norris.png")
            .setTitle(`**Chuck Norris Joke** ${discord.getEmoji("tohruSmug")}`)
            .setDescription(
            `${discord.getEmoji("star")}_ID:_ \`${jokes.data.value[i].id}\`\n` +
            `${discord.getEmoji("star")}_Joke:_ ${jokes.data.value[i].joke}\n`
            )
            chuckArray.push(chuckEmbed)
        }

        if (chuckArray.length === 1) {
            message.channel.send(chuckArray[0])
        } else {
            embeds.createReactionEmbed(chuckArray)
        }
        return
    }
}

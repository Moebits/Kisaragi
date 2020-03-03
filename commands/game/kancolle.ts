import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Kancolle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gets information on a kancolle ship girl.",
            help:
            `
            \`kancolle shipgirl\` - Gets information on the shipgirl.
            `,
            examples:
            `
            \`=>kancolle fubuki\`
            \`=>kancolle hibiki\`
            `,
            aliases: ["kc", "kantai", "kantaicollection"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const query = Functions.combineArgs(args, 1)
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("kancolle", "https://upload.wikimedia.org/wikipedia/en/0/02/Kantai_Collection_logo.png")
            .setTitle(`**Kancolle Search** ${discord.getEmoji("PoiHug")}`))
        }
        const res = await axios.get(`https://kancolle.fandom.com/api/v1/Search/List?query=${query}&limit=25&minArticleQuality=10`)
        const id = res.data?.items[0]?.id
        if (!id) {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("kancolle", "https://upload.wikimedia.org/wikipedia/en/0/02/Kantai_Collection_logo.png")
            .setTitle(`**Kancolle Search** ${discord.getEmoji("PoiHug")}`))
        }
        const res2 = await axios.get(`https://kancolle.fandom.com/api/v1/Articles/AsSimpleJson?id=${id}`)
        const thumb = await axios.get(`https://kancolle.fandom.com/api/v1/Articles/Details?ids=${id}`).then((r: any) => r.data.items[id].thumbnail)
        const girl = res2.data.sections[0]?.title
        const rawGallery = await axios.get(`https://kancolle.fandom.com/wiki/${girl}/Gallery`).then((r)=>r.data)
        const matches = rawGallery.match(/(https:\/\/vignette.wikia.nocookie.net\/kancolle\/images\/)(.*?)(.png)/g)
        let filtered = matches.filter((m: any)=> m.includes(girl))
        filtered = Functions.removeDuplicates(filtered)
        let description = ""
        let index = 1
        let done = false

        while (description.length < 1500 && done === false) {
            if (!res2.data.sections[index]?.title) {
                done = true
                continue
            } else if (!res2.data.sections[index]?.content[0]?.elements.map((c: any) => c.text)) {
                index++
                continue
            }
            description += `${discord.getEmoji("star")}_${res2.data.sections[index]?.title}_: ${res2.data.sections[index]?.content[0]?.elements.map((c: any) => c.text).join("\n")}\n`
            index++
        }
        const kancolleArray: MessageEmbed[] = []
        for (let i = 0; i < filtered.length; i++) {
            const kancolleEmbed = embeds.createEmbed()
            kancolleEmbed
            .setAuthor("kancolle", "https://upload.wikimedia.org/wikipedia/en/0/02/Kantai_Collection_logo.png")
            .setTitle(`**Kancolle Search** ${discord.getEmoji("PoiHug")}`)
            .setURL(`https://kancolle.fandom.com/wiki/${girl}`)
            .setThumbnail(thumb)
            .setImage(filtered[i])
            .setDescription(`${discord.getEmoji("star")}_Ship Girl:_ **${girl}**\n` + description)
            kancolleArray.push(kancolleEmbed)
        }
        if (kancolleArray.length === 1) {
            message.channel.send(kancolleArray[0])
        } else {
            embeds.createReactionEmbed(kancolleArray, true)
        }
        return
    }
}

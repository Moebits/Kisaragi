import {Message} from "discord.js"
import * as GoogleImages from "google-images"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class GoogleImageCommand extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

        const embeds = new Embeds(discord, message)
        const query = Functions.combineArgs(args, 1)

        const images = new GoogleImages(process.env.GOOGLE_IMAGES_ID, process.env.GOOGLE_API_KEY)

        const result = await images.search(query)
        const imagesArray: any = []
        for (const i in result) {
            const imageEmbed = embeds.createEmbed()
            const size = Math.floor(result[i].size/1024)
            imageEmbed
            .setAuthor("google images", "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png")
            .setURL(result[i].parentPage)
            .setTitle(`**Image Search** ${discord.getEmoji("raphi")}`)
            .setDescription(
                `${discord.getEmoji("star")}_Website:_ ${result[i].parentPage}\n` +
                `${discord.getEmoji("star")}_Width:_ ${result[i].width} _Height:_ ${result[i].height}\n` +
                `${discord.getEmoji("star")}_Filesize:_ ${size}KB\n` +
                `${discord.getEmoji("star")}_Description:_ ${result[i].description}`
            )
            .setImage(result[i].url)
            imagesArray.push(imageEmbed)
        }
        embeds.createReactionEmbed(imagesArray)
    }
}

import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import GoogleImages from "google-images"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

const pinArray: MessageEmbed[] = []

export default class Pinterest extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public pinterestError = (discord: Kisaragi, message: Message, embeds: Embeds) => {
        const pinterestEmbed = embeds.createEmbed()
        pinterestEmbed
        .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
        .setTitle(`**Pinterest Search** ${discord.getEmoji("aquaUp")}`)
        .setDescription("No results were found. Try searching on the pinterest website: " +
        "[Pinterest Website](https://www.pinterest.com/)")
        message.channel.send(pinterestEmbed)
    }

    public pinterestPin = (discord: Kisaragi, message: Message, response: any) => {
        const embeds = new Embeds(discord, message)
        const pinterestEmbed = embeds.createEmbed()
        pinterestEmbed
        .setAuthor("pinterest", "https://www.stickpng.com/assets/images/580b57fcd9996e24bc43c52e.png")
        .setTitle(`**Pinterest Search** ${discord.getEmoji("aquaUp")}`)
        .setURL(response.url)
        .setImage(response.image.original.url)
        .setDescription(
            `${discord.getEmoji("star")}_Creator:_ **${response.creator.url}**\n` +
            `${discord.getEmoji("star")}_Board:_ **${response.board.url}**\n` +
            `${discord.getEmoji("star")}_Creation Date:_ **${Functions.formatDate(response.created_at)}**\n` +
            `${discord.getEmoji("star")}_Saves:_ **${response.counts.saves}**\n` +
            `${discord.getEmoji("star")}_Comments:_ **${response.counts.comments}**\n` +
            `${discord.getEmoji("star")}_Source:_ **${response.link ? response.link : "None"}**\n` +
            `${discord.getEmoji("star")}_Note:_ ${response.note ? response.note : "None"}\n`
        )
        pinArray.push(pinterestEmbed)
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const accessToken = (process.env.PINTEREST_ACCESS_TOKEN)
        const images = new GoogleImages(process.env.PINTEREST_SEARCH_ID!, process.env.GOOGLE_API_KEY!)

        if (args[1] === "board") {
            const user = args[2]
            const board = args[3]
            if (!user || !board) return
            const json = await axios.get(`https://api.pinterest.com/v1/boards/${user}/${board}/pins/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`)
            const response = json.data
            for (const i in response) {
                this.pinterestPin(discord, message, response[i])
            }
            if (!pinArray.join("")) {
                this.pinterestError(discord, message, embeds)
                return
            }
            if (pinArray.length === 1) {
                message.channel.send(pinArray[0])
            } else {
                embeds.createReactionEmbed(pinArray)
            }
            return
        }

        if (args[1] === "search") {
            const query = Functions.combineArgs(args, 2)
            const json = await axios.get(`https://api.pinterest.com/v1/me/search/pins/?access_token=${accessToken}&query=${query.replace(/ /g, "-")}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`)
            const response = json.data
            for (const i in response) {
                this.pinterestPin(discord, message, response[i])
            }
            if (!pinArray.join("")) {
                this.pinterestError(discord, message, embeds)
                return
            }
            if (pinArray.length === 1) {
                message.channel.send(pinArray[0])
            } else {
                embeds.createReactionEmbed(pinArray)
            }
            return
        }

        const query = Functions.combineArgs(args, 1)
        const imageResult = await images.search(query)
        let random = 0
        let pin
        for (let i = 0; i < imageResult.length; i++) {
            if (pin) break
            random = Math.floor(Math.random() * imageResult.length)
            pin = (imageResult[random].url.match(/\d{18}/g))
        }
        if (!pin) {
            this.pinterestError(discord, message, embeds)
            return
        }
        const json = await axios.get(`https://api.pinterest.com/v1/pins/${pin}/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`)
        const response = json.data.data
        const board = response.board.url.slice(25)
        const response2 = await axios.get(`https://api.pinterest.com/v1/boards/${board}/pins/?access_token=${accessToken}&fields=id,link,url,creator,board,created_at,note,color,counts,media,attribution,image,metadata`)
        const random2 = Math.floor(Math.random() * response2.data.length)
        this.pinterestPin(discord, message, response2.data[random2])
        if (!pinArray.join("")) {
            this.pinterestError(discord, message, embeds)
            return
        }
        message.channel.send(pinArray[0])
    }
}

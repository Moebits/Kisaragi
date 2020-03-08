import bandcamp from "bandcamp-scraper"
import type {Message, MessageEmbed} from "discord.js"
import Giphy, {MultiResponse} from "giphy-api"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Bandcamp extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for artists, tracks, and albums on bandcamp.",
            help:
            `
            \`bandcamp query\` - Searches for everything matching the query
            `,
            examples:
            `
            \`=>bandcamp kawaii future bass\`
            \`=>bandcamp tenpi\`
            `,
            aliases: ["bc"],
            random: "string",
            cooldown: 5
        })
    }

    public albumEmbed = (album: BandcampAlbum) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const bandcampEmbed = embeds.createEmbed()
        bandcampEmbed
        .setAuthor("bandcamp", "https://s4.bcbits.com/img/favicon/favicon-32x32.png", "https://bandcamp.com/")
        .setTitle(`**Bandcamp Search** ${discord.getEmoji("raphi")}`)
        .setImage(album.imageUrl ?? "")
        .setURL(album.url)
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${album.name}**\n` +
            `${discord.getEmoji("star")}_Artist:_ **${album.artist}**\n` +
            `${discord.getEmoji("star")}_Tracks:_ **${album.numTracks}**\n` +
            `${discord.getEmoji("star")}_Length:_ **${album.numMinutes}m**\n` +
            `${discord.getEmoji("star")}_Link:_ ${album.url}\n` +
            `${discord.getEmoji("star")}_Release Date:_ **${Functions.formatDate(new Date(album.releaseDate))}**\n` +
            `${discord.getEmoji("star")}_Tags:_ **${album.tags.join(", ")}**\n`
        )
        return bandcampEmbed
    }

    public trackEmbed = (track: BandcampTrack) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const bandcampEmbed = embeds.createEmbed()
        bandcampEmbed
        .setAuthor("bandcamp", "https://s4.bcbits.com/img/favicon/favicon-32x32.png", "https://bandcamp.com/")
        .setTitle(`**Bandcamp Search** ${discord.getEmoji("raphi")}`)
        .setImage(track.imageUrl ?? "")
        .setURL(track.url)
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${track.name}**\n` +
            `${discord.getEmoji("star")}_Artist:_ **${track.artist}**\n` +
            `${discord.getEmoji("star")}_Album:_ **${track.album}**\n` +
            `${discord.getEmoji("star")}_Link:_ ${track.url}\n` +
            `${discord.getEmoji("star")}_Release Date:_ **${Functions.formatDate(new Date(track.releaseDate))}**\n` +
            `${discord.getEmoji("star")}_Tags:_ **${track.tags.join(", ")}**\n`
        )
        return bandcampEmbed
    }

    public artistEmbed = (artist: BandcampArtist) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const bandcampEmbed = embeds.createEmbed()
        bandcampEmbed
        .setAuthor("bandcamp", "https://s4.bcbits.com/img/favicon/favicon-32x32.png", "https://bandcamp.com/")
        .setTitle(`**Bandcamp Search** ${discord.getEmoji("raphi")}`)
        .setImage(artist.imageUrl ?? "")
        .setURL(artist.url)
        .setDescription(
            `${discord.getEmoji("star")}_Name:_ **${artist.name}**\n` +
            `${discord.getEmoji("star")}_Link:_ ${artist.url}\n` +
            `${discord.getEmoji("star")}_Location:_ **${artist.location ?? "None"}**\n` +
            `${discord.getEmoji("star")}_Tags:_ **${artist.tags.join(", ")}**\n`
        )
        return bandcampEmbed
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const query = Functions.combineArgs(args, 1)

        if (!query) {
            return this.noQuery(embeds.createEmbed())
        }

        let data: any = []
        await new Promise((resolve) => {
            bandcamp.search({query}, (err, res) => {
                data = res
                resolve()
            })
        })

        const bandcampArray: MessageEmbed[] = []
        for (let i = 0; i < data.length; i++) {
            switch (data[i].type) {
                case "artist":
                    const artistEmbed = this.artistEmbed(data[i])
                    bandcampArray.push(artistEmbed)
                    break
                case "fan":
                    const fanEmbed = this.artistEmbed(data[i])
                    bandcampArray.push(fanEmbed)
                    break
                case "track":
                    const trackEmbed = this.trackEmbed(data[i])
                    bandcampArray.push(trackEmbed)
                    break
                case "album":
                    const albumEmbed = this.albumEmbed(data[i])
                    bandcampArray.push(albumEmbed)
                    break
                default:
            }
        }

        if (bandcampArray.length === 1) {
            message.channel.send(bandcampArray[0])
        } else {
            embeds.createReactionEmbed(bandcampArray, false, true)
        }
        return
    }
}

interface BandcampItem {
    type: string
    name: string
    url: string
    imageUrl?: string
    tags: string[]
}

interface BandcampArtist extends BandcampItem {
    genre: string
    location?: string
}

interface BandcampTrack extends BandcampItem {
    releaseDate: string
    album: string
    artist: string
}

interface BandcampAlbum extends BandcampItem {
    releaseDate: string
    numTracks: number
    numMinutes: number
    artist: string
}

import {Message, MessageEmbed} from "discord.js"
import Soundcloud from "soundcloud.ts"
import {Command} from "../../structures/Command"
import {Functions} from "../../structures/Functions"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class SoundCloud extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for soundcloud tracks, users, and playlists.",
            help:
            `
            \`soundcloud query\` - Searches for tracks with the query
            \`soundcloud user query\` - Searches for users with the query
            \`soundcloud playlist query\` - Searches for playlists with the query
            `,
            examples:
            `
            \`=>soundcloud anime\`
            \`=>soundcloud user synthion\`
            \`=>soundcloud playlist kawaii\`
            `,
            aliases: ["s"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const star = discord.getEmoji("star")
        const embeds = new Embeds(discord, message)

        const soundcloud = new Soundcloud(process.env.SOUNDCLOUD_CLIENT_ID, process.env.SOUNDCLOUD_OAUTH_TOKEN)

        if (args[1] === "user") {
            const query = Functions.combineArgs(args, 2)
            if (!query) {
                return this.noQuery(embeds.createEmbed()
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg")
                .setTitle(`**Soundcloud User** ${discord.getEmoji("karenSugoi")}`))
            }
            const soundcloudArray: MessageEmbed[] = []
            const users = await soundcloud.users.search({q: query})
            for (let i = 0; i < users.length; i++) {
                const soundcloudEmbed = embeds.createEmbed()
                soundcloudEmbed
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg")
                .setTitle(`**Soundcloud User** ${discord.getEmoji("karenSugoi")}`)
                .setURL(users[i].permalink_url)
                .setImage(users[i].avatar_url)
                .setDescription(
                    `${star}_Name:_ **${users[i].username}**\n` +
                    `${star}_Tracks:_ **${users[i].track_count}**\n` +
                    `${star}_Following:_ **${users[i].followings_count}**\n`+
                    `${star}_Followers:_ **${users[i].followers_count}**\n` +
                    `${star}_Comments:_ **${users[i].comments_count}**\n` +
                    `${star}_Description:_ ${Functions.checkChar(users[i].description, 500, " ")}`
                )
                soundcloudArray.push(soundcloudEmbed)
            }
            if (soundcloudArray.length === 1) {
                return message.channel.send(soundcloudArray[0])
            }
            return embeds.createReactionEmbed(soundcloudArray)
        }

        if (args[1] === "playlist") {
            const query = Functions.combineArgs(args, 2)
            if (!query) {
                return this.noQuery(embeds.createEmbed()
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg")
                .setTitle(`**Soundcloud Playlist** ${discord.getEmoji("karenSugoi")}`))
            }
            const soundcloudArray: MessageEmbed[] = []
            const playlists = await soundcloud.playlists.search({q: query})
            for (let i = 0; i < playlists.length; i++) {
                const soundcloudEmbed = embeds.createEmbed()
                soundcloudEmbed
                .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg")
                .setTitle(`**Soundcloud Playlist** ${discord.getEmoji("karenSugoi")}`)
                .setURL(playlists[i].permalink_url)
                .setImage(playlists[i].artwork_url!)
                .setDescription(
                    `${star}_Title:_ **${playlists[i].title}**\n` +
                    `${star}_Genre:_ **${playlists[i].genre ? playlists[i].genre : "None"}**\n` +
                    `${star}_Creation Date:_ **${Functions.formatDate(new Date(playlists[i].created_at))}**\n` +
                    `${star}_Tracks:_ **${playlists[i].track_count}**\n` +
                    `${star}_Duration:_ **${playlists[i].duration}**\n`+
                    `${star}_Description:_ ${Functions.checkChar((playlists[i].description ? playlists[i].description! : "None"), 500, " ")}`
                )
                soundcloudArray.push(soundcloudEmbed)
            }
            if (soundcloudArray.length === 1) {
                return message.channel.send(soundcloudArray[0])
            }
            return embeds.createReactionEmbed(soundcloudArray)
        }

        const query = Functions.combineArgs(args, 1)
        if (!query) {
            return this.noQuery(embeds.createEmbed()
            .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg")
            .setTitle(`**Soundcloud Search** ${discord.getEmoji("karenSugoi")}`))
        }
        const soundcloudArray: MessageEmbed[] = []
        const tracks = await soundcloud.tracks.search({q: query})
        for (let i = 0; i < tracks.length; i++) {
            const soundcloudEmbed = embeds.createEmbed()
            soundcloudEmbed
            .setAuthor("soundcloud", "https://i1.sndcdn.com/avatars-000681921569-32qkcn-t500x500.jpg")
            .setTitle(`**Soundcloud Search** ${discord.getEmoji("karenSugoi")}`)
            .setURL(tracks[i].permalink_url)
            .setThumbnail(tracks[i].user.avatar_url)
            .setImage(tracks[i].artwork_url)
            .setDescription(
                `${star}_Title:_ **${tracks[i].title}**\n` +
                `${star}_Artist:_ **${tracks[i].user.username}**\n` +
                `${star}_Genre:_ **${tracks[i].genre}**\n` +
                `${star}_Creation Date:_ **${Functions.formatDate(new Date(tracks[i].created_at))}**\n` +
                `${star}_Plays:_ **${tracks[i].playback_count}**\n` +
                `${star}_Likes:_ **${tracks[i].likes_count}**\n` +
                `${star}_Reposts:_ **${tracks[i].reposts_count}**\n` +
                `${star}_Comments:_ **${tracks[i].comment_count}**\n`+
                `${star}_Description:_ ${Functions.checkChar(tracks[i].description, 500, " ")}`
            )
            soundcloudArray.push(soundcloudEmbed)
        }
        if (soundcloudArray.length === 1) {
            return message.channel.send(soundcloudArray[0])
        }
        return embeds.createReactionEmbed(soundcloudArray)
    }
}

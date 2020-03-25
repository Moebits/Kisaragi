import axios from "axios"
import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

export default class Instagram extends Command {
    private readonly headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"}
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for posts and users on instagram.",
            help:
            `
            \`instagram query\` - Searches for tagged posts
            \`instagram user name\` - Searches for a user
            `,
            examples:
            `
            \`=>instagram anime\`
            \`=>instagram user imtenpi\`
            `,
            aliases: [],
            random: "none",
            cooldown: 10
        })
    }

    public getUsername = async (id: string) => {
        const headers = {
            "authority": "commentpicker.com",
            "method": "GET",
            "path": `/actions/instagram-username-action.php?userid=${id}&token=6d7d1bb1474aacdfa69da0b39daefe8e78a0cb3aa283f501b627e932279305fb`,
            "scheme": "https",
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cookie": "PHPSESSID=5qsgj4sq4vflghc8b1i1hi11vu; _ga=GA1.2.2124161850.1585104044; _gid=GA1.2.1696025883.1585104044; __gads=ID=750ff2c0c4c22d10:T=1585104044:S=ALNI_MYIsmHP-PZTNitXn2QaqikzghKhAg; _fbp=fb.1.1585104045302.310021285; fontsLoaded=true; _gat=1",
            "referer": "https://commentpicker.com/instagram-username.php",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36"
        }
        const url = `https://commentpicker.com/actions/instagram-username-action.php?userid=${id}&token=6d7d1bb1474aacdfa69da0b39daefe8e78a0cb3aa283f501b627e932279305fb`
        const data = await axios.get(url, {headers}).then((r) => r.data)
        return {username: data.username, pfp: data.profile_pic_url}
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        if (args[1] === "user") {
            const name = args[2]
            if (!name) {
                return this.noQuery(embeds.createEmbed()
                .setAuthor("instagram", "https://clipartart.com/images/new-instagram-clipart-15.jpg", "https://www.instagram.com/")
                .setTitle(`**Instagram Search** ${discord.getEmoji("gabBob")}`))
            }
            const html = await axios.get(`https://www.instagram.com/${name}`, {headers: this.headers}).then((r) => r.data)
            .catch(() => {
                return this.invalidQuery(embeds.createEmbed()
                .setAuthor("instagram", "https://clipartart.com/images/new-instagram-clipart-15.jpg", "https://www.instagram.com/")
                .setTitle(`**Instagram Search** ${discord.getEmoji("gabBob")}`))
            })
            const json = JSON.parse(html.match(/({"config":)((.|\n)*?)(?=;<\/script>)/g)?.[0])
            const user = json.entry_data.ProfilePage[0].graphql.user
            const followers = user.edge_followed_by.count
            const following = user.edge_follow.count
            const posts = user.edge_owner_to_timeline_media.edges
            const instagramArray: MessageEmbed[] = []
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i].node
                const url = `https://www.instagram.com/p/${post.shortcode}/`
                const caption = Functions.checkChar(post.edge_media_to_caption.edges[0].node.text.replace(/-\n/g, ""), 500, "")
                const comments = post.edge_media_to_comment.count
                const likes = post.edge_liked_by.count
                const image = post.display_url
                const instagramEmbed = embeds.createEmbed()
                instagramEmbed
                .setAuthor("instagram", "https://clipartart.com/images/new-instagram-clipart-15.jpg", "https://www.instagram.com/")
                .setTitle(`**Instagram Search** ${discord.getEmoji("gabBob")}`)
                .setThumbnail(user.profile_pic_url_hd)
                .setImage(image)
                .setURL(url)
                .setDescription(
                    `${discord.getEmoji("star")}_Username:_ [**${user.username}**](https://www.instagram.com/${user.username})\n` +
                    `${discord.getEmoji("star")}_Followers:_ **${followers}**\n` +
                    `${discord.getEmoji("star")}_Following:_ **${following}**\n` +
                    `${discord.getEmoji("star")}_Link:_ **${user.external_url}**\n` +
                    `${discord.getEmoji("star")}_Bio:_ ${user.biography}\n` +
                    `${discord.getEmoji("star")}_Likes:_ **${likes}**\n` +
                    `${discord.getEmoji("star")}_Comments:_ **${comments}**\n` +
                    `${discord.getEmoji("star")}_Caption:_ ${caption}`
                )
                instagramArray.push(instagramEmbed)
            }
            if (instagramArray.length === 1) {
                await message.channel.send(instagramArray[0])
            } else {
                embeds.createReactionEmbed(instagramArray, true, true)
            }
            return
        }

        const text = Functions.combineArgs(args, 1).trim().replace(/ +/g, "")
        const html = await axios.get(`https://www.instagram.com/explore/tags/${text}/`, {headers: this.headers}).then((r) => r.data)
        .catch(() => {
            return this.invalidQuery(embeds.createEmbed()
            .setAuthor("instagram", "https://clipartart.com/images/new-instagram-clipart-15.jpg", "https://www.instagram.com/")
            .setTitle(`**Instagram Search** ${discord.getEmoji("gabBob")}`))
        })
        const json = JSON.parse(html.match(/({"config":)((.|\n)*?)(?=;<\/script>)/g)?.[0])
        const posts = json.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.edges
        const max = posts.length > 20 ? 20 : posts.length
        const instagramArray: MessageEmbed[] = []
        for (let i = 0; i < max; i++) {
            const post = posts[i].node
            const url = `https://www.instagram.com/p/${post.shortcode}/`
            const caption = Functions.checkChar(post.edge_media_to_caption.edges[0].node.text.replace(/-\n/g, ""), 1000, "")
            const comments = post.edge_media_to_comment.count
            const likes = post.edge_liked_by.count
            const {username, pfp} = await this.getUsername(post.owner.id)
            const image = post.display_url
            const instagramEmbed = embeds.createEmbed()
            instagramEmbed
            .setAuthor("instagram", "https://clipartart.com/images/new-instagram-clipart-15.jpg", "https://www.instagram.com/")
            .setTitle(`**Instagram Search** ${discord.getEmoji("gabBob")}`)
            .setURL(url)
            .setThumbnail(pfp)
            .setImage(image)
            .setDescription(
                `${discord.getEmoji("star")}_Username:_ [**${username}**](https://www.instagram.com/${username})\n` +
                `${discord.getEmoji("star")}_Likes:_ **${likes}**\n` +
                `${discord.getEmoji("star")}_Comments:_ **${comments}**\n` +
                `${discord.getEmoji("star")}_Caption:_ ${caption}`
            )
            instagramArray.push(instagramEmbed)
        }
        if (instagramArray.length === 1) {
            await message.channel.send(instagramArray[0])
        } else {
            embeds.createReactionEmbed(instagramArray, true, true)
        }
        return
    }
}

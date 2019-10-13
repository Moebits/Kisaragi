import {Message, MessageEmbed} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"

const GDClient = require("geometry-dash-api")
const gd = require("gdprofiles")
const base64 = require("base-64")

export default class GeometryDash extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches for gd players and levels.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")

        const GD = new GDClient({
            userName: "Tenpi",
            password: process.env.GD_PASSWORD
        })

        const {api} = GD
        await GD.login()

        if (args[1] === "user") {
            const nick = Functions.combineArgs(args, 2)
            const user = await api.users.getByNick(nick)
            const gdUser = await gd.search(nick)
            console.log(gdUser)
            const levelArray: MessageEmbed[] = []
            for (const i in gdUser.lastLevels) {
                levelArray.push(gdUser.lastLevels[i].name)
            }
            const gdEmbed = embeds.createEmbed()
            gdEmbed
            .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
            .setTitle(`**GD Profile** ${discord.getEmoji("raphi")}`)
            .setURL(`https://gdprofiles.com/${user.nick}`)
            .setDescription(
                `${star}${discord.getEmoji("gdStar")} **${user.stars}** ` +
                `${discord.getEmoji("gdDiamond")} **${user.diamonds}** ` +
                `${discord.getEmoji("gdCoin")} **${user.coins}** ` +
                `${discord.getEmoji("gdUserCoin")} **${user.userCoins}** ` +
                `${discord.getEmoji("gdDemon")} **${user.demons}** ` +
                `${discord.getEmoji("gdCP")} **${user.creatorPoints}** \n` +
                `${star}_Name:_ **${user.nick}**\n` +
                `${star}_Rank:_ **#${user.top}**\n` +
                `${star}_User ID:_ **${user.userID}**\n` +
                `${star}_Account ID:_ **${user.accountID}**\n` +
                `${star}_Account Type:_ **${user.rightsString}**\n` +
                `${star}_Youtube:_ **${user.youtube}**\n` +
                `${star}_Twitter:_ **${user.twitter}**\n` +
                `${star}_Twitch:_ **${user.twitch}**\n` +
                `${star}_Description:_ ${gdUser.desc ? gdUser.desc : "None"}\n` +
                `${star}_Levels:_ ${levelArray.join("") ? levelArray.join(",     ") : "None"}\n`
            )
            .setImage(`https://img.youtube.com/vi/${gdUser.video.embed.replace(/www.youtube.com\/embed\//g, "")}/maxresdefault.jpg`)
            .setThumbnail(gdUser.img.player)
            message.channel.send(gdEmbed)
            return
        }

        if (args[1] === "daily") {
            const level = await api.levels.getDaily()
            const user = await api.users.getById(level.creatorUserID)
            const gdEmbed = embeds.createEmbed()
            gdEmbed
            .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
            .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
            .setDescription(
                `${star}_Name:_ **${level.name}**\n` +
                `${star}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
                `${star}_Level ID:_ **${level.levelID}**\n` +
                `${star}_Song ID:_ **${level.songID}**\n` +
                `${star}_Difficulty:_ **${level.diff}**\n` +
                `${star}_Stars:_ **${level.stars}**\n` +
                `${star}_Downloads:_ **${level.downloads}**\n` +
                `${star}_Likes:_ **${level.likes}**\n` +
                `${star}_Password:_ **${level.password ? level.password : "None"}**\n` +
                `${star}_Description:_ ${base64.decode(level.desc)}\n`
            )
            message.channel.send(gdEmbed)
            return
        }

        if (args[1] === "weekly") {
            const level = await api.levels.getWeekly()
            const user = await api.users.getById(level.creatorUserID)
            const gdEmbed = embeds.createEmbed()
            gdEmbed
            .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
            .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
            .setDescription(
                `${star}_Name:_ **${level.name}**\n` +
                `${star}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
                `${star}_Level ID:_ **${level.levelID}**\n` +
                `${star}_Song ID:_ **${level.songID}**\n` +
                `${star}_Difficulty:_ **${level.diff}**\n` +
                `${star}_Stars:_ **${level.stars}**\n` +
                `${star}_Downloads:_ **${level.downloads}**\n` +
                `${star}_Likes:_ **${level.likes}**\n` +
                `${star}_Password:_ **${level.password ? level.password : "None"}**\n` +
                `${star}_Description:_ ${base64.decode(level.desc)}\n`
            )
            message.channel.send(gdEmbed)
            return
        }

        if (args[1] === "top") {
            const topArray: MessageEmbed[] = []
            let users
            if (args[2] === "100") {
                users = await api.tops.get({type: "top", count: 100})
            } else if (args[2] === "friends") {
                users = await api.tops.get({type: "friends", count: 100})
            } else if (args[2] === "global") {
                users = await api.tops.get({type: "relative", count: 100})
            } else if (args[2] === "creators") {
                users = await api.tops.get({type: "creators", count: 100})
            }
            for (let i = 0; i < users.length; i++) {
                const topEmbed = embeds.createEmbed()
                topEmbed
                .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
                .setTitle(`**GD Leaderboard** ${discord.getEmoji("raphi")}`)
                .setDescription(
                    `${star}_Rank:_ **${users[i].top}**\n` +
                    `${star}_User:_ **${users[i].nick}**\n` +
                    `${star}_User ID:_ **${users[i].userID}**\n` +
                    `${star}_Account ID:_ **${users[i].accountID}**\n`
                )
                topArray.push(topEmbed)
            }
            embeds.createReactionEmbed(topArray)
            return
        }

        const query = Functions.combineArgs(args, 1)

        if (query.match(/\d+/g)) {
            const level = await api.levels.getById({levelID: query.trim()})
            const user = await api.users.getById(level.creatorUserID)
            console.log(level.creatorUserID)
            console.log(user)
            const gdLevel = await gd.getLevelInfo(query.trim())
            console.log(level)
            console.log(gdLevel)
            return
        }

        const result = await api.levels.find({query: query.trim()})
        const gdArray: MessageEmbed[] = []
        for (let i = 0; i < result.levels.length; i++) {
            const level = await api.levels.getById({levelID: result.levels[i].levelID})
            const user = await api.users.getById(result.levels[i].creatorUserID)
            const gdEmbed = embeds.createEmbed()
            gdEmbed
            .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
            .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
            .setDescription(
                `${star}_Name:_ **${level.name}**\n` +
                `${star}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
                `${star}_Level ID:_ **${level.levelID}**\n` +
                `${star}_Song ID:_ **${level.songID}**\n` +
                `${star}_Difficulty:_ **${level.diff}**\n` +
                `${star}_Stars:_ **${level.stars}**\n` +
                `${star}_Downloads:_ **${level.downloads}**\n` +
                `${star}_Likes:_ **${level.likes}**\n` +
                `${star}_Password:_ **${level.password ? level.password : "None"}**\n` +
                `${star}_Description:_ ${base64.decode(level.desc)}\n`

            )
            gdArray.push(gdEmbed)
        }
        embeds.createReactionEmbed(gdArray)
    }
}

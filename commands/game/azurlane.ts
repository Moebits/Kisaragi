import axios from "axios"
import {Message, EmbedBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

export default class AzurLane extends Command {
    private readonly defaults = [
        "Kisaragi", "Laffey", "Helena", "Javelin",
        "Warspite", "Unicorn", "Hibiki", "Akatsuki", "Fubuki",
        "Yuudachi", "Yukikaze", "Akashi", "Mutsuki", "Jenkins",
        "Urakaze", "Kizuna AI", "Belfast", "Gridley", "Sims", "Hammann",
        "Eldridge", "Omaha", "Portland", "Crescent", "Juno", "Vampire",
        "Cygnet", "Uzuki", "Shigure", "Bailey", "Minazuki", "Mikazuki",
        "Nicholas", "Radford", "Little Bel", "Agano", "Z18", "22", "Noire", "33",
        "HDN Neptune", "Ayanami", "Murasaki Shion"
    ]
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gets information on an azur lane ship girl.",
            help:
            `
            \`azurlane shipgirl\` - Gets information on the shipgirl.
            \`azurlane\` - Gets some handpicked girls.
            `,
            examples:
            `
            \`=>azurlane kisaragi\`
            \`=>azurlane laffey\`
            `,
            aliases: ["al"],
            random: "none",
            cooldown: 10
        })
    }

    public findNationality = (str: string) => {
        const sakura = str.match(/Ships of Sakura Empire/g)
        if (sakura) return "Sakura Empire"
        const eagle = str.match(/Ships of Eagle Union/g)
        if (eagle) return "Eagle Union"
        const royal = str.match(/Ships of Royal Navy/g)
        if (royal) return "Royal Navy"
        const iron = str.match(/Ships of Ironblood/g)
        if (iron) return "Ironblood"
        const eastern = str.match(/Ships of Eastern Radiance/g)
        if (eastern) return "Eastern Radiance"
        const north = str.match(/Ships of North Union/g)
        if (north) return "North Union"
        const iris = str.match(/Ships of Iris Libre/g)
        if (iris) return "Iris Libre"
        const vichya = str.match(/Ships of Vichya Dominion/g)
        if (vichya) return "Vichya Dominion"
        const sardegna = str.match(/Ships of Sardegna Empire/g)
        if (sardegna) return "Sardegna Empire"
        return "Other"
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (discord.checkMuted(message)) if (!perms.checkNSFW()) return
        let query = Functions.combineArgs(args, 1).trim().replace(/ +/g, "_")
        if (!query) {
            query = this.defaults[Math.floor(Math.random()*this.defaults.length)].trim().replace(/ +/g, "_")
        }
        query = query.split("_").map((q) => Functions.toProperCase(q)).join("_")

        if (query.match(/azurlane.koumakan.jp/)) {
            query = query.replace("https://azurlane.koumakan.jp/", "")
        }
        const headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36"
        }
        const res = await axios.get(`https://azurlane.koumakan.jp/${query}`, {headers})
        const matches = res.data.match(/(https:\/\/azurlane.koumakan.jp\/w\/images\/)(.*?)(.png)/g)
        const artist = res.data.match(/(?<=title="Artists">)(.*?)(?=<\/a>)/g)
        const pixivID = res.data.match(/(?<=https:\/\/www.pixiv.net\/member.php\?id=)(.*?)(?=")/g)
        const twitter = res.data.match(/(?<=https:\/\/twitter.com\/)(.*?)(?=")/g)
        const nationality = this.findNationality(res.data)
        let chibis = matches.filter((m: any) => m.toLowerCase().includes("chibi"))
        const pics = matches.filter((m: any) => m.toLowerCase().includes(query.toLowerCase()) && !m.toLowerCase().includes("banner") && !m.toLowerCase().includes("chibi"))
        let history = null as any
        try {
            history = await axios.get(`https://azurlane.koumakan.jp/${query}/History`, {headers}).then((r) => r.data)
        } catch {
            // Do nothing
        }
        const matches2 = history ? history.match(/(?<=Historical References)((.|\n)*?)(?=<!--)/gm) : "None available!"
        const description = Functions.cleanHTML(String(matches2))
        if (chibis.length < pics.length) {
            chibis = Functions.fillArray(chibis, chibis[length-1], pics.length)
        }

        const azurArray: EmbedBuilder[] = []
        for (let i = 0; i < pics.length; i++) {
            const azurEmbed = embeds.createEmbed()
            azurEmbed
            .setAuthor({name: "azur lane", iconURL: "https://azurlane.koumakan.jp/akashi-apple-touch-icon.png"})
            .setTitle(`**Azur Lane Search** ${discord.getEmoji("kisaragiBawls")}`)
            .setURL(`https://azurlane.koumakan.jp/${query}`)
            .setThumbnail(chibis[i])
            .setImage(pics[i])
            .setDescription(
                `${discord.getEmoji("star")}_Ship Girl:_ **${Functions.toProperCase(query.replace(/_/g, " "))}**\n` +
                `${discord.getEmoji("star")}_Nationality:_ **${nationality}**\n` +
                `${discord.getEmoji("star")}_Artist:_ **${artist ? artist[0] : "Not found"}**\n` +
                `${discord.getEmoji("star")}_Pixiv:_ ${pixivID ? `https://www.pixiv.net/member.php?id=${pixivID[0]}` : "None"}\n` +
                `${discord.getEmoji("star")}_Twitter_: ${twitter ? `https://www.twitter.com/${twitter[0]}` : "None"}\n` +
                `${discord.getEmoji("star")}_Historical References:_ ${Functions.checkChar(description, 1500, " ")}`
            )
            azurArray.push(azurEmbed)
        }

        if (azurArray.length === 1) {
            message.channel.send({embeds: [azurArray[0]]})
        } else {
            embeds.createReactionEmbed(azurArray, true, true)
        }
        return
    }
}

import axios from "axios"
import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Time extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Gets the current time in a city.",
            help:
            `
            \`time city/country\` - Gets the time.
            `,
            examples:
            `
            \`=>time new york\`
            `,
            aliases: [],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const city = Functions.combineArgs(args, 1)?.trim()
        if (!city) return message.reply(`What city do you want to search for ${discord.getEmoji("kannaCurious")}`)

        const timezones = await axios.get(`http://worldtimeapi.org/api/timezone`).then((r) => r.data)

        const zone = timezones.find((z: any) => z.toLowerCase().includes(city.toLowerCase().replace(/ +/g, "_")))
        if (!zone) return message.reply("Could not find that city!")

        const time = await axios.get(`http://worldtimeapi.org/api/timezone/${zone}`).then((r) => r.data)
        const utc = time.utc_offset
        const date = new Date(time.datetime)
        const day = Functions.formatDate(date)
        const weekDay = date.getDay()
        const cityName = zone.replace(/\//g, " ").replace("America", "").replace(/_/g, " ").trim()

        const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sundays"]

        function format(date: Date) {
            let hours = date.getHours()
            const minutes = date.getMinutes()
            const seconds = date.getSeconds()
            const milli = date.getMilliseconds()
            const ampm = hours >= 12 ? "pm" : "am"
            hours = hours % 12
            hours = hours ? hours : 12
            const strHr = hours < 10 ? `0${hours}` : `${hours}`
            const strMin = minutes < 10 ? `0${minutes}` : `${minutes}`
            const strSec = seconds < 10 ? `0${seconds}` : `${seconds}`
            const strMil = milli < 100 ? (milli < 10 ? `00${milli}` : `0${milli}`) : `${milli}`
            const strTime = `${strHr}:${strMin}:${strSec}.${strMil}${ampm}`
            return strTime
          }

        const timeEmbed = embeds.createEmbed()
        timeEmbed
        .setAuthor("time", "https://i.imgur.com/5RSmgv7.png")
        .setTitle(`**Time** ${discord.getEmoji("yaoi")}`)
        .setDescription(
            `${discord.getEmoji("star")}_City:_ **${cityName}**\n` +
            `${discord.getEmoji("star")}_Timezone:_ \`GMT ${utc}\`\n` +
            `${discord.getEmoji("star")}_Date:_ \`${weekDays[weekDay-1]}, ${day}\`\n` +
            `${discord.getEmoji("star")}_Current Time:_ \`${format(date)}\``
        )
        return message.channel.send(timeEmbed)
    }
}

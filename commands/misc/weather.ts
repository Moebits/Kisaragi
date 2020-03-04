import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Weather extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Posts the current weather in a city.",
            help:
            `
            \`weather city\` - Gets the weather
            `,
            examples:
            `
            \`=>weather new york\`
            `,
            aliases: ["forecast", "climate"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const weather = require("openweather-apis")
        weather.setAPPID(process.env.WEATHER_API_KY)

        const city = Functions.combineArgs(args, 1)?.trim()
        if (!city) return message.reply(`What city do you want to search for ${discord.getEmoji("kannaCurious")}`)
        weather.setCity(city)

        weather.getAllWeather(function(err: Error, json: any) {
            console.log(json)
        })

        return
    }
}

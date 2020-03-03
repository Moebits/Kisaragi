import {Message} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import * as pack from "./../../package.json"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Info extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Posts info on the bot.",
          help:
          `
          \`info\` - Posts bot info
          `,
          examples:
          `
          \`=>info\`
          `,
          aliases: ["about"],
          cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        let cmdCount = 0
        const subDir = fs.readdirSync("./commands")
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(`./commands/${subDir[i]}`)
            for (let j = 0; j < commands.length; j++) {
                cmdCount++
            }
        }

        const description =
        `[Kisaragi](https://azurlane.koumakan.jp/Kisaragi) was a Mutsuki-Class Destroyer of the Imperial Japanese Navy ` +
        `during World War II. She was sunken at the [Battle of Wake Island](https://en.wikipedia.org/wiki/Battle_of_Wake_Island) by American aircraft. ` +
        `Kisaragi is part of [Azur Lane](https://en.wikipedia.org/wiki/Azur_Lane), which is basically a game where cute anime girl personifications of World War II battleships battle it out. ` +
        `Azur Lane also has an [Anime](https://myanimelist.net/anime/38328/Azur_Lane) series.`

        const infoEmbed = embeds.createEmbed()
        .setTitle(`**Kisaragi Bot Info** ${discord.getEmoji("tohruSmug")}`)
        .setURL(`https://discord.gg/77yGmWM`)
        .setThumbnail(message.author.displayAvatarURL({format: "png", dynamic: true}))
        .setDescription(
            `${discord.getEmoji("star")}_Description:_ ${description}\n` +
            `${discord.getEmoji("star")}_Version:_ **${pack.version}**\n` +
            `${discord.getEmoji("star")}_Creator_: **Tenpi#7920**\n` +
            `${discord.getEmoji("star")}_Library_: **Discord.js**\n` +
            `${discord.getEmoji("star")}_Runtime:_ **Node.js**\n` +
            `${discord.getEmoji("star")}_Language:_ **Typescript**\n` +
            `${discord.getEmoji("star")}_Database:_ **PostgreSQL**\n` +
            `${discord.getEmoji("star")}_Guilds:_ **${discord.guilds.cache.size}**\n` +
            `${discord.getEmoji("star")}_Channels:_ **${discord.channels.cache.size}**\n` +
            `${discord.getEmoji("star")}_Users:_ **${discord.users.cache.size}**\n` +
            `${discord.getEmoji("star")}_Emojis:_ **${discord.emojis.cache.size}**\n` +
            `${discord.getEmoji("star")}_Commands_: **${cmdCount}**\n`+
            `[**Invite Link**](https://discordapp.com/api/oauth2/authorize?client_id=593838271650332672&permissions=2113793271&scope=bot)\n` +
            `[**Support Server**](https://discord.gg/77yGmWM)\n` +
            `[**Github Repository**](https://github.com/Tenpi/Kisaragi)`
        )
        return message.channel.send(infoEmbed)
    }
}

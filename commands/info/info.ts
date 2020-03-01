import {Message} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import * as pack from "./../../package.json"
import {Embeds} from "./../../structures/Embeds"
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
          aliases: [],
          cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const star = discord.getEmoji("star")

        let cmdCount = 0
        const subDir = fs.readdirSync("./commands")
        for (let i = 0; i < subDir.length; i++) {
            const commands = fs.readdirSync(`./commands/${subDir[i]}`)
            for (let j = 0; j < commands.length; j++) {
                cmdCount++
            }
        }

        const infoEmbed = embeds.createEmbed()
        .setTitle(`**Kisaragi Bot Info** ${discord.getEmoji("tohruSmug")}`)
        .setURL(`https://discord.gg/77yGmWM`)
        .setThumbnail(message.author.displayAvatarURL({format: "png", dynamic: true}))
        .setDescription(
            `${star}_Version:_ **${pack.version}**\n` +
            `${star}_Creator_: **Tenpi#7920**\n` +
            `${star}_Library_: **Discord.js**\n` +
            `${star}_Runtime:_ **Node.js**\n` +
            `${star}_Language:_ **Typescript**\n` +
            `${star}_Guilds:_ **${discord.guilds.cache.size}**\n` +
            `${star}_Channels:_ **${discord.channels.cache.size}**\n` +
            `${star}_Users:_ **${discord.users.cache.size}**\n` +
            `${star}_Emojis:_ **${discord.emojis.cache.size}**\n` +
            `${star}_Commands_: **${cmdCount}**\n`+
            `[**Invite Link**](https://discordapp.com/api/oauth2/authorize?client_id=593838271650332672&permissions=2113793271&scope=bot)\n` +
            `[**Support Server**](https://discord.gg/77yGmWM)\n` +
            `[**Github Repository**](https://github.com/Tenpi/Kisaragi)`
        )
        return message.channel.send(infoEmbed)
    }
}

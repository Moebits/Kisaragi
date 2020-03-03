import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Pickle extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: `Posts your pickle size ${discord.getEmoji("tohruSmug")}`,
            help:
            `
            _Note:_ The sizes are seeded and won't change ${discord.getEmoji("tohruSmug")}
            \`pickle\` - Gets your pickle size.
            \`pickle @user\` - Gets the pickle size of the user.
            `,
            examples:
            `
            \`=>pickle\`
            `,
            aliases: ["pp", "peepee", "hotdog", "dong", "cock", "dick", "penis", "sausage", "fun stick", "schlong", "willy", "ding dong", "peen", "meat stick"],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        let seed = message.author.id
        let name = message.author.username
        if (message.mentions.users.size > 0) {
            seed = message.mentions.users.first()!.id
            name = message.mentions.users.first()!.username
        }

        function seededRandom(seed: number) {
            const x = Math.sin(seed) * 10000
            return x - Math.floor(x)
        }

        const random = seededRandom(Number(seed))
        const pickleSize = random * 10
        let flavorText = ""
        if (pickleSize < 4) {
                flavorText = `It's alright, size isn't everything... ${discord.getEmoji("chinoSmug")}`
        } else if ((pickleSize > 4) && pickleSize < 7) {
                flavorText = `That's pretty average. ${discord.getEmoji("mexShrug")}`
        } else {
                flavorText = `Wow... You are so big <3 ${discord.getEmoji("gabrielLick")}`
        }
        message.channel.send(`**${name}**, your ${args[0]} size is **${pickleSize.toFixed(2)}inches** (${(pickleSize*2.54).toFixed(2)}cm). ${flavorText}`)
        return
    }
}

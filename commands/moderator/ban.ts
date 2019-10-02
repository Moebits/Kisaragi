import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class Ban extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const perms = new Permissions(discord, message)
        if (await perms.checkMod(message)) return
        const banEmbed: any = embeds.createEmbed()
        const reasonArray: any = []
        const userArray: any = []

        for (let i = 1; i < args.length; i++) {
            if (args[i].match(/\d+/g)) {
                userArray.push(args[i].match(/\d+/g))[0]
            } else {
                reasonArray.push(args[i])
            }
        }

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        const members: any = []
        for (let i = 0; i < userArray.length; i++) {
            const member = message.guild!.members.find((m: any) => m.id === userArray[i].join(""))
            if (member) {
                members.push(`<@${member.id}>`)
            } else {
                members.push(`<@${userArray[i]}>`)
            }
            banEmbed
            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were banned from ${message.guild!.name} for reason:_ **${reason}**`)
            try {
                const dm = await member!.createDM()
                await dm.send(banEmbed)
            } catch (err) {
                console.log(err)
            }
            await message.guild!.members.ban(member ? member : userArray[i][0], {reason})
        }
        banEmbed
        .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
        .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully banned ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(banEmbed)
        return
    }
}

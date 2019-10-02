import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class Unban extends Command {
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
        const banEmbed = embeds.createEmbed()
        const reasonArray: string[] = []
        const userArray: string[] = []

        for (let i = 1; i < args.length; i++) {
            if (args[i].match(/\d+/g)) {
                userArray.push(args[i].match(/\d+/g)!.toString())[0]
            } else {
                reasonArray.push(args[i])
            }
        }

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        const members: any = []
        for (let i = 0; i < userArray.length; i++) {
            const member = message.guild!.members.find((m: any) => m.id === userArray[i])
            if (member) {
                members.push(`<@${member.id}>`)
            } else {
                members.push(`<@${userArray[i]}>`)
            }
            banEmbed
            .setTitle(`**You Were Unbanned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were unbanned from ${message.guild!.name} for reason:_ **${reason}**`)
            try {
                const dm = await member!.createDM()
                await dm.send(banEmbed)
            } catch (err) {
                console.log(err)
            }
            await message.guild!.members.unban(member ? member : userArray[i][0], reason)
        }
        banEmbed
        .setAuthor("unban", "https://discordemoji.com/assets/emoji/bancat.png")
        .setTitle(`**Member Unbanned** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully unbanned ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(banEmbed)
        return
    }
}

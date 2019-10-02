import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class Kick extends Command {
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
        const kickEmbed: any = embeds.createEmbed()
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
            const member = message.guild!.members.find((m: any) => m.id === userArray[i].join("")) as GuildMember
            members.push(`<@${member.id}>`)
            kickEmbed
            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
            .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were kicked from ${message.guild!.name} for reason:_ **${reason}**`)
            const dm = await member.createDM()
            try {
                await dm.send(kickEmbed)
            } catch (err) {
                console.log(err)
            }
            await member.kick(reason)
        }
        kickEmbed
        .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
        .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully kicked ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(kickEmbed)
        return
    }
}

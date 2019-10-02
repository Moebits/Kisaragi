import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Unmute extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const perms = new Permissions(discord, message)
        const sql = new SQLQuery(message)
        if (await perms.checkMod(message)) return
        const muteEmbed: any = embeds.createEmbed()
        const mute = await sql.fetchColumn("special roles", "mute role")
        if (!mute) return message.reply("You need to set a mute role first!")
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
            await member.roles.remove(mute.join(""))
            members.push(`<@${member.id}>`)
            const dm = await member.createDM()
            muteEmbed
            .setAuthor("unmute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
            .setTitle(`**You Were Unmuted** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were unmuted in ${message.guild!.name} for reason:_ **${reason}**`)
            await dm.send(muteEmbed)
        }
        muteEmbed
        .setAuthor("unmute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
        .setTitle(`**Member Unmuted** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully unmuted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(muteEmbed)
        return
    }
}

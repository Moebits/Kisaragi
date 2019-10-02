import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Mute extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const perms = new Permissions(discord, message)
        if (await perms.checkMod(message)) return
        const muteEmbed = embeds.createEmbed()
        const mute = await sql.fetchColumn("special roles", "mute role")
        if (!mute) return message.reply("You need to set a mute role first!")
        const reasonArray: string[] = []
        const userArray: string[] = []

        for (let i = 1; i < args.length; i++) {
            if (args[i].match(/\d+/g)) {
                userArray.push(args[i].match(/\d+/g)![0])
            } else {
                reasonArray.push(args[i])
            }
        }

        const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!"

        const members: string[] = []
        for (let i = 0; i < userArray.length; i++) {
            const member = message.guild!.members.find((m: GuildMember) => m.id === userArray[i]) as GuildMember
            await member.roles.add(mute.join(""))
            members.push(`<@${member.id}>`)
            const dm = await member.createDM()
            muteEmbed
            .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
            .setTitle(`**You Were Muted** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were muted in ${message.guild!.name} for reason:_ **${reason}**`)
            await dm.send(muteEmbed)
        }
        muteEmbed
        .setAuthor("mute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
        .setTitle(`**Member Muted** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully muted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(muteEmbed)
        return
    }
}

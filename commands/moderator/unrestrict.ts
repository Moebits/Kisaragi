import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Unrestrict extends Command {
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
        const restrictEmbed = embeds.createEmbed()
        const restrict = await sql.fetchColumn("special roles", "restricted role")
        if (!restrict) return message.reply("You need to set a restricted role first!")
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
            await member.roles.remove(restrict.join(""))
            members.push(`<@${member.id}>`)
            const dm = await member.createDM()
            restrictEmbed
            .setAuthor("unrestrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
            .setTitle(`**You Were Unrestricted** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were unrestricted in ${message.guild!.name} for reason:_ **${reason}**`)
            await dm.send(restrictEmbed)
        }
        restrictEmbed
        .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
        .setTitle(`**Member Unrestricted** ${discord.getEmoji("kannaFU")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully unrestricted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send(restrictEmbed)
        return
    }
}

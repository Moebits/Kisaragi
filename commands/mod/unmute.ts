import {GuildMember, Message} from "discord.js"
import {SlashCommandSubcommand, SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Unmute extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Unmutes users.",
            help:
            `
            \`unmute @user1 @user2 reason?\` - Unmutes the user(s) with an optional reason
            \`unmute id1 id2 reason?\` - Unmutes by user id instead of mention
            `,
            examples:
            `
            \`=>unmute @user\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 3,
            subcommandEnabled: true
        })
        const reasonOption = new SlashCommandOption()
            .setType("string")
            .setName("reason")
            .setDescription("The unmute reason.")

        const userOption = new SlashCommandOption()
            .setType("user")
            .setName("user")
            .setDescription("The user to unmute.")
            .setRequired(true)
            
        this.subcommand = new SlashCommandSubcommand()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .addOption(userOption)
            .addOption(reasonOption)
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        if (!await perms.checkMod()) return
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
            const member = message.guild!.members.cache.find((m: GuildMember) => m.id === userArray[i]) as GuildMember
            if (!members) continue
            await member.roles.remove(mute)
            const data = {type: "unmute", user: member.id, executor: message.author.id, date: Date.now(), guild: message.guild?.id, reason, context: message.url}
            discord.emit("caseUpdate", data)
            members.push(`<@${member.id}>`)
            const dm = await member.createDM()
            muteEmbed
            .setAuthor({name: "unmute", iconURL: "https://images.emojiterra.com/mozilla/512px/1f507.png"})
            .setTitle(`**You Were Unmuted** ${discord.getEmoji("mexShrug")}`)
            .setDescription(`${discord.getEmoji("star")}_You were unmuted in ${message.guild!.name} for reason:_ **${reason}**`)
            await dm.send({embeds: [muteEmbed]}).catch(() => null)
        }
        if (!members[0]) return message.reply(`Invalid users ${discord.getEmoji("kannaFacepalm")}`)
        muteEmbed
        .setAuthor({name: "unmute", iconURL: "https://images.emojiterra.com/mozilla/512px/1f507.png"})
        .setTitle(`**Member Unmuted** ${discord.getEmoji("mexShrug")}`)
        .setDescription(`${discord.getEmoji("star")}_Successfully unmuted ${members.join(", ")} for reason:_ **${reason}**`)
        message.channel.send({embeds: [muteEmbed]})
        return
    }
}

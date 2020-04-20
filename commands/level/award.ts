import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "../../structures/Functions"
import {Kisaragi} from "../../structures/Kisaragi"
import {Points} from "../../structures/Points"

export default class Award extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Award users level xp.",
            help:
            `
            _Note: Remove points by awarding a negative number._
            \`award @user1 @user2? points\` - Gives the users points
            `,
            examples:
            `
            \`=>award @user1 @user2 @user3 2000\`
            \`=>award @user1 -99999\`
            `,
            aliases: ["give"],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const points = new Points(discord, message)

        const input = Functions.combineArgs(args, 1)
        const amount = input.match(/(?<!<@)(^-?\d+|-?\d+$|(?<= )-?\d+)(?!>)/)?.[0] ?? 0
        let users = input.match(/(?<=<@)(.*?)(?=>)/)?.map((u) => u)

        if (!users) return message.reply(`You must mention a user ${discord.getEmoji("kannaFacepalm")}`)
        users = Functions.removeDuplicates(users)
        for (let i = 0; i < users.length; i++) {
            try {
                await points.giveScore(users[i].replace("!", ""), Number(amount))
            } catch {
                return message.reply(`This server has no scores ${discord.getEmoji("kannaFacepalm")}`)
            }
        }

        const awardEmbed = embeds.createEmbed()
        awardEmbed
        .setAuthor("award", "https://www.wakeed.org/wp-content/uploads/2016/07/award-icon-06.png")
        .setTitle(`**Point Award** ${discord.getEmoji("karenSugoi")}`)
        .setDescription(
            `${discord.getEmoji("star")}Awarded **${amount}** points to ${users.map((u) => `<@${u}>`).join(", ")}!`
        )
        return message.channel.send(awardEmbed)
    }
}

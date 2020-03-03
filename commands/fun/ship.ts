import canvas, {Canvas} from "canvas"
import {Message, MessageAttachment} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class $8ball extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Ships two users.",
            help:
            `
            \`ship @user1 @user2\` - Ships two users.
            `,
            examples:
            `
            \`=>ship @user1 @user2\`
            `,
            aliases: ["shipping"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        if (message.mentions.members?.size !== 2) {
            return message.reply(`You need to mention two users! ${discord.getEmoji("kannaWave")}`)
        }
        const user1 = message.mentions.members.first()
        const user2 = message.mentions.members.last()
        const shipname = String(user1?.displayName.substring(0, user1.displayName.length/2)) + String(user2?.displayName.substring(user2.displayName.length/2))

        const can = new canvas.Canvas(128*3, 128)
        const ctx = can.getContext("2d")

        const av1 = await canvas.loadImage(user1?.user.displayAvatarURL({format: "png"})!)
        const av2 = await canvas.loadImage(user2?.user.displayAvatarURL({format: "png"})!)
        const heart = await canvas.loadImage("https://i.ya-webdesign.com/images/anime-heart-png-1.png")
        ctx.drawImage(av1, 0, 0, can.width/3, can.height)
        ctx.drawImage(heart, can.width/3, 0, can.width/3, can.height)
        ctx.drawImage(av2, (can.width/3)*2, 0, can.width/3, can.height)

        const attachment = new MessageAttachment(can.toBuffer(), "ship.png")

        message.channel.send(
            `Aww, what a cute shipping! ${discord.getEmoji("gabrielLick")}\n` +
            `_Shipping Name:_ **${shipname}**`, attachment)
        return
    }
}

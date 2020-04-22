import {Message, MessageEmbed, MessageReaction, User} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Embed extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Creates a custom embed and sends it.",
            help:
            `
            \`embed\` - Open the embed creator
            `,
            examples:
            `
            \`=>embed\`
            `,
            aliases: ["embeds", "customembed", "richembed", "messageembed"],
            random: "none",
            cooldown: 3,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const infoEmbed = embeds.createEmbed()
        const embed = new MessageEmbed()
        embed.setColor(infoEmbed.color ?? "")

        infoEmbed
        .setAuthor("embed creator", "https://www.churchtrac.com/articles/apple/uploads/2017/09/Antu_insert-image.svg_-846x846.png")
        .setTitle(`**Custom Embed** ${discord.getEmoji("RaphiSmile")}`)
        .setDescription(
            `_Edit this embed by clicking on the reactions._\n` +
            `${discord.getEmoji("info")} - Displays this menu\n` +
            `${discord.getEmoji("title")} - Sets the title of the embed\n` +
            `${discord.getEmoji("description")} - Sets the description (main text) of the embed\n` +
            `${discord.getEmoji("image")} - Set the image of the embed\n` +
            `${discord.getEmoji("thumbnail")} - Sets the thumbnail of the embed\n` +
            `${discord.getEmoji("author")} - Sets the author text\n` +
            `${discord.getEmoji("authorImage")} - Sets the author image\n` +
            `${discord.getEmoji("footer")} - Sets the footer text\n` +
            `${discord.getEmoji("footerImage")} - Sets the footer image\n` +
            `${discord.getEmoji("color")} - Sets the color of the embed\n` +
            `${discord.getEmoji("json")} - Creates an embed from JSON data\n` +
            `${discord.getEmoji("done")} - Sends the embed\n` +
            `${discord.getEmoji("cancel")} - Quits the embed creator\n`
        )

        const reactions = ["info", "title", "description", "image", "thumbnail", "author", "authorImage", "footer", "footerImage", "color", "json", "done", "cancel"]

        const msg = await message.channel.send(infoEmbed)
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))

        const infoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("info") && user.bot === false
        const titleCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("title") && user.bot === false
        const descriptionCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("description") && user.bot === false
        const imageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("image") && user.bot === false
        const thumbnailCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("thumbnail") && user.bot === false
        const authorCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("author") && user.bot === false
        const authorImageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("authorImage") && user.bot === false
        const footerCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("footer") && user.bot === false
        const footerImageCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("footerImage") && user.bot === false
        const colorCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("color") && user.bot === false
        const jsonCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("json") && user.bot === false
        const doneCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("done") && user.bot === false
        const cancelCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("cancel") && user.bot === false
        const info = msg.createReactionCollector(infoCheck)
        const title = msg.createReactionCollector(titleCheck)
        const description = msg.createReactionCollector(descriptionCheck)
        const image = msg.createReactionCollector(imageCheck)
        const thumbnail = msg.createReactionCollector(thumbnailCheck)
        const author = msg.createReactionCollector(authorCheck)
        const authorImage = msg.createReactionCollector(authorImageCheck)
        const footer = msg.createReactionCollector(footerCheck)
        const footerImage = msg.createReactionCollector(footerImageCheck)
        const color = msg.createReactionCollector(colorCheck)
        const json = msg.createReactionCollector(jsonCheck)
        const done = msg.createReactionCollector(doneCheck)
        const cancel = msg.createReactionCollector(cancelCheck)

        info.on("collect", (reaction, user) => {
            msg.edit(infoEmbed)
        })
    }
}

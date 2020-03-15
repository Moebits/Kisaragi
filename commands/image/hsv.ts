import {Message, MessageReaction, User} from "discord.js"
import jimp from "jimp"
import sharp, {Sharp} from "sharp"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Images} from "./../../structures/Images"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class HSV extends Command {
    private readonly historyStates: string[] = []
    private historyIndex = 0
    private original = ""
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Changes the hue, saturation, lightness, brightness, and contrast of an image.",
          help:
          `
          \`hsv\` - hsv on the last posted image
          \`hsv url\` - hsv on the linked image
          `,
          examples:
          `
          \`=>hsv\`
          `,
          aliases: ["hsb", "hsl", "bc"],
          cooldown: 10
        })
    }

    public hsvEmbed = async (image: string) => {
        const images = new Images(this.discord, this.message)
        this.historyStates.push(image)
        this.historyIndex++
        const embeds = new Embeds(this.discord, this.message)
        const link = await images.fileIOUpload(image)
        const hsvEmbed = embeds.createEmbed()
        hsvEmbed
        .setAuthor("hsv", "https://cdn4.iconfinder.com/data/icons/app-ui/100/images-512.png")
        .setTitle(`**HSV Adjustment** ${this.discord.getEmoji("chinoSmug")}`)
        .setImage(link)
        .setDescription(
            `${this.discord.getEmoji("brightness")}_Brightness:_ -> _Changes the brightness of the image_.\n` +
            `${this.discord.getEmoji("contrast")}_Contrast:_ -> _Changes the contrast of the image_.\n` +
            `${this.discord.getEmoji("hue")}_Hue:_ -> _Changes the hue of the image_.\n` +
            `${this.discord.getEmoji("saturation")}_Saturation:_ -> Changes the saturation of the image._\n` +
            `${this.discord.getEmoji("value")}_Lightness:_ -> Changes the lightness of the image._`
        )
        return hsvEmbed
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const images = new Images(discord, message)
        const seed = Math.floor(Math.random() * 10000)
        let url: string | undefined
        if (args[1]) {
            url = args[1]
        } else {
            url = await discord.fetchLastAttachment(message)
        }
        if (!url) return message.reply(`Could not find an image ${discord.getEmoji("kannaCurious")}`)
        const image = sharp(url)
        this.historyStates.push(url)
        const hsvEmbed = embeds.createEmbed()
        const dest = `./images/${seed}.png`
        this.original = dest
        await image.png().toFile(dest)
        const link = await images.fileIOUpload(dest)
        hsvEmbed
        .setAuthor("hsv", "https://cdn4.iconfinder.com/data/icons/app-ui/100/images-512.png")
        .setTitle(`**HSV Adjustment** ${discord.getEmoji("chinoSmug")}`)
        .setImage(link)
        .setDescription(
            `${this.discord.getEmoji("brightness")}_Brightness:_ -> _Changes the brightness of the image_.\n` +
            `${this.discord.getEmoji("contrast")}_Contrast:_ -> _Changes the contrast of the image_.\n` +
            `${this.discord.getEmoji("hue")}_Hue:_ -> _Changes the hue of the image_.\n` +
            `${this.discord.getEmoji("saturation")}_Saturation:_ -> Changes the saturation of the image._\n` +
            `${this.discord.getEmoji("value")}_Lightness:_ -> Changes the lightness of the image._`
        )
        const msg = await message.channel.send(hsvEmbed)
        const reactions = ["brightness", "contrast", "hue", "saturation", "value", "undo", "redo", "reset"]
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))

        const brightnessCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("brightness") && user.bot === false
        const contrastCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("contrast") && user.bot === false
        const hueCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("hue") && user.bot === false
        const saturationCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("saturation") && user.bot === false
        const valueCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("value") && user.bot === false
        const undoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("undo") && user.bot === false
        const redoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("redo") && user.bot === false
        const resetCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("reset") && user.bot === false
        const brightness = msg.createReactionCollector(brightnessCheck)
        const contrast = msg.createReactionCollector(contrastCheck)
        const hue = msg.createReactionCollector(hueCheck)
        const saturation = msg.createReactionCollector(saturationCheck)
        const value = msg.createReactionCollector(valueCheck)
        const undo = msg.createReactionCollector(undoCheck)
        const redo = msg.createReactionCollector(redoCheck)
        const reset = msg.createReactionCollector(resetCheck)
        let argArray: string[] = []
        async function getArgs(response: Message) {
            argArray = response.content.split(" ")
            await response.delete()
        }

        brightness.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the brightness factor (-100-100).`)
            await embeds.createPrompt(getArgs)
            rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 0
            if (factor < -100) factor = -100
            if (factor > 100) factor = 100
            factor /= 100
            const image = await jimp.read(this.historyStates[this.historyIndex])
            image.brightness(factor)
            const newDest = `./images/${seed}_brightness.png`
            await image.writeAsync(newDest)
            const newEmbed = await this.hsvEmbed(newDest)
            msg.edit(newEmbed)
        })

        contrast.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the contrast factor (-100-100).`)
            await embeds.createPrompt(getArgs)
            rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 0
            if (factor < -100) factor = -100
            if (factor > 100) factor = 100
            factor /= 100
            const image = await jimp.read(this.historyStates[this.historyIndex])
            image.contrast(factor)
            const newDest = `./images/${seed}_constrast.png`
            await image.writeAsync(newDest)
            const newEmbed = await this.hsvEmbed(newDest)
            msg.edit(newEmbed)
        })

        hue.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the hue (-360-360).`)
            await embeds.createPrompt(getArgs)
            rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 0
            if (factor < -360) factor = -360
            if (factor > 360) factor = 360
            const image = sharp(this.historyStates[this.historyIndex])
            image.modulate({hue: factor})
            const newDest = `./images/${seed}_hue.png`
            await image.png().toFile(newDest)
            const newEmbed = await this.hsvEmbed(newDest)
            msg.edit(newEmbed)
        })

        saturation.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the saturation multiplier (eg. 1.5).`)
            await embeds.createPrompt(getArgs)
            rep.delete()
            const factor = Number(argArray[0]) ? Number(argArray[0]) : 1
            const image = sharp(this.historyStates[this.historyIndex])
            image.modulate({saturation: factor})
            const newDest = `./images/${seed}_saturation.png`
            await image.png().toFile(newDest)
            const newEmbed = await this.hsvEmbed(newDest)
            msg.edit(newEmbed)
        })

        value.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the lightness multiplier (eg. 0.5).`)
            await embeds.createPrompt(getArgs)
            rep.delete()
            const factor = Number(argArray[0]) ? Number(argArray[0]) : 1
            const image = sharp(this.historyStates[this.historyIndex])
            image.modulate({brightness: factor})
            const newDest = `./images/${seed}_lightness.png`
            await image.png().toFile(newDest)
            const newEmbed = await this.hsvEmbed(newDest)
            msg.edit(newEmbed)
        })

        undo.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            this.historyIndex--
            if (this.historyIndex < 0) this.historyIndex = 0
            const newEmbed = await this.hsvEmbed(this.historyStates[this.historyIndex])
            msg.edit(newEmbed)
        })

        redo.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            this.historyIndex++
            if (this.historyIndex > this.historyStates.length - 1) this.historyIndex = this.historyStates.length - 1
            const newEmbed = await this.hsvEmbed(this.historyStates[this.historyIndex])
            msg.edit(newEmbed)
        })

        reset.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const newEmbed = await this.hsvEmbed(this.original)
            msg.edit(newEmbed)
        })

    }
}

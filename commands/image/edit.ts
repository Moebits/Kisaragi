import {Message, MessageReaction, User} from "discord.js"
import fs from "fs"
import jimp from "jimp"
import path from "path"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Images} from "../../structures/Images"
import {Kisaragi} from "../../structures/Kisaragi"
import {Functions} from "./../../structures/Functions"

export default class Edit extends Command {
    private readonly links: string[] = []
    private readonly publicIDs: string[] = []
    private readonly historyStates: string[] = []
    private historyIndex = -1
    private original = ""
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Opens the image editor to apply multiple edits to an image.",
          help:
          `
          _Note: The undo max is 10 (to save storage space)._
          \`edit\` - Edits the last posted image
          \`edit url\` - Edits the linked image
          `,
          examples:
          `
          \`=>edit\`
          `,
          aliases: ["editor", "adjustment"],
          cooldown: 10
        })
    }

    public hsvEmbed = async (image: string, exists?: boolean) => {
        const images = new Images(this.discord, this.message)
        const embeds = new Embeds(this.discord, this.message)
        let url: string
        if (!exists) {
            const {link, publicID} = await images.cloudUpload(image, "image edits")
            await images.cloudDelete(this.publicIDs)
            const deleted = await images.queuedDelete(this.historyStates)
            this.historyIndex -= deleted
            this.historyIndex++
            this.historyStates.splice(this.historyIndex, Infinity, image)
            this.publicIDs.splice(this.historyIndex, Infinity, publicID)
            this.links.splice(this.historyIndex, Infinity, link)
            url = link
        } else {
            if (this.historyIndex < 0) {
                url = this.original
            } else {
                url = this.links[this.historyIndex]
            }
        }
        const hsvEmbed = embeds.createEmbed()
        hsvEmbed
        .setAuthor("edit", "https://cdn4.iconfinder.com/data/icons/app-ui/100/images-512.png")
        .setTitle(`**Image Adjustments** ${this.discord.getEmoji("chinoSmug")}`)
        .setImage(url)
        .setURL(url)
        .setDescription(
            `${this.discord.getEmoji("brightness")}_Brightness:_ -> _Changes the brightness of the image_.\n` +
            `${this.discord.getEmoji("contrast")}_Contrast:_ -> _Changes the contrast of the image_.\n` +
            `${this.discord.getEmoji("hue")}_Hue:_ -> _Changes the hue of the image_.\n` +
            `${this.discord.getEmoji("saturation")}_Saturation:_ -> _Changes the saturation of the image._\n` +
            `${this.discord.getEmoji("value")}_Lightness:_ -> _Changes the lightness of the image._`
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
        const image = await jimp.read(url)
        const hsvEmbed = embeds.createEmbed()
        if (!fs.existsSync(path.join(__dirname, "../../images"))) fs.mkdirSync(path.join(__dirname, "../../images"))
        const dest = path.join(__dirname, `../../images/${seed}.jpg`)
        await image.writeAsync(dest)
        const {link} = await images.cloudUpload(dest, "image edits")
        this.original = link
        hsvEmbed
        .setAuthor("edit", "https://cdn4.iconfinder.com/data/icons/app-ui/100/images-512.png")
        .setTitle(`**Image Adjustments** ${discord.getEmoji("chinoSmug")}`)
        .setImage(link)
        .setURL(link)
        .setDescription(
            `${this.discord.getEmoji("brightness")}_Brightness:_ -> _Changes the brightness of the image_.\n` +
            `${this.discord.getEmoji("contrast")}_Contrast:_ -> _Changes the contrast of the image_.\n` +
            `${this.discord.getEmoji("hue")}_Hue:_ -> _Changes the hue of the image_.\n` +
            `${this.discord.getEmoji("saturation")}_Saturation:_ -> _Changes the saturation of the image._\n` +
            `${this.discord.getEmoji("value")}_Lightness:_ -> _Changes the lightness of the image._`
        )
        const msg = await message.channel.send(hsvEmbed)
        const reactions = ["brightness", "contrast", "hue", "saturation", "value", "flip", "undo", "redo", "reset"]
        for (let i = 0; i < reactions.length; i++) await msg.react(discord.getEmoji(reactions[i]))

        const brightnessCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("brightness") && user.bot === false
        const contrastCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("contrast") && user.bot === false
        const hueCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("hue") && user.bot === false
        const saturationCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("saturation") && user.bot === false
        const valueCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("value") && user.bot === false
        const flipCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("flip") && user.bot === false
        const tintCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("tint") && user.bot === false
        const invertCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("invert") && user.bot === false
        const undoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("undo") && user.bot === false
        const redoCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("redo") && user.bot === false
        const resetCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("reset") && user.bot === false
        const saveCheck = (reaction: MessageReaction, user: User) => reaction.emoji === this.discord.getEmoji("save") && user.bot === false
        const brightness = msg.createReactionCollector(brightnessCheck)
        const contrast = msg.createReactionCollector(contrastCheck)
        const hue = msg.createReactionCollector(hueCheck)
        const saturation = msg.createReactionCollector(saturationCheck)
        const value = msg.createReactionCollector(valueCheck)
        const flip = msg.createReactionCollector(flipCheck)
        const tint = msg.createReactionCollector(tintCheck)
        const invert = msg.createReactionCollector(invertCheck)
        const undo = msg.createReactionCollector(undoCheck)
        const redo = msg.createReactionCollector(redoCheck)
        const reset = msg.createReactionCollector(resetCheck)
        const save = msg.createReactionCollector(saveCheck)
        let argArray: string[] = []
        let argTest = false
        async function getArgs(response: Message) {
            argArray = response.content.split(" ")
            await response.delete()
            argTest = true
        }
        const promise = new Promise((resolve) => {
            while (true) {
                if (argTest === true) {
                    argTest = false
                    resolve()
                    break
                }
            }
        })

        brightness.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the brightness factor (-100-100).`)
            await embeds.createPrompt(getArgs)
            await promise
            await rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 0
            if (factor < -100) factor = -100
            if (factor > 100) factor = 100
            factor /= 100
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            const image = await jimp.read(current)
            image.brightness(factor)
            let newDest = path.join(__dirname, `../../images/${seed}_brightness`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        contrast.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the contrast factor (-100-100).`)
            await embeds.createPrompt(getArgs)
            await promise
            await rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 0
            if (factor < -100) factor = -100
            if (factor > 100) factor = 100
            factor /= 100
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            console.log(current)
            const image = await jimp.read(current)
            image.contrast(factor)
            let newDest = path.join(__dirname, `../../images/${seed}_contrast`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        hue.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the hue (-360-360).`)
            await embeds.createPrompt(getArgs)
            await promise
            await rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 0
            if (factor < -360) factor = -360
            if (factor > 360) factor = 360
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            const image = await jimp.read(current)
            image.color([{apply: "hue", params: [factor]}])
            let newDest = path.join(__dirname, `../../images/${seed}_hue`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        saturation.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the saturation factor (-100-100).`)
            await embeds.createPrompt(getArgs)
            await promise
            await rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 0
            let setDesaturate = false
            if (factor < 0) {
                setDesaturate = true
                factor = Math.abs(factor)
            }
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            const image = await jimp.read(current)
            if (setDesaturate) {
                // @ts-ignore
                image.color([{apply: "desaturate", params: [factor]}])
            } else {
                // @ts-ignore
                image.color([{apply: "saturate", params: [factor]}])
            }
            let newDest = path.join(__dirname, `../../images/${seed}_saturation`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        value.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the lightness factor (-100-100).`)
            await embeds.createPrompt(getArgs)
            await promise
            await rep.delete()
            let factor = Number(argArray[0]) ? Number(argArray[0]) : 1
            let setDarken = false
            if (factor < 0) {
                setDarken = true
                factor = Math.abs(factor)
            }
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            const image = await jimp.read(current)
            if (setDarken) {
                // @ts-ignore
                image.color([{apply: "darken", params: [factor]}])
            } else {
                // @ts-ignore
                image.color([{apply: "lighten", params: [factor]}])
            }
            let newDest = path.join(__dirname, `../../images/${seed}_lightness`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        flip.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Type \`x\` to flip horizontally, \`y\` to flip vertically, or \`xy\` for both.`)
            await embeds.createPrompt(getArgs)
            await promise
            await rep.delete()
            const input = argArray.join("")
            let setHorizontal = false
            let setVertical = false
            if (/x/.test(input)) {
                setHorizontal = true
            } else if (/y/.test(input)) {
                setVertical = true
            }
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            const image = await jimp.read(current)
            if (setHorizontal) {
                image.flip(true, false)
            } else if (setVertical) {
                image.flip(false, true)
            }
            let newDest = path.join(__dirname, `../../images/${seed}_flip`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        tint.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            const rep = await message.channel.send(`<@${user.id}>, Enter the color and opacity.`)
            await embeds.createPrompt(getArgs)
            await promise
            await rep.delete()
            const color = args[1] ? args[1] : "#ff0fd3"
            const opacity = Number(args[2]) ? Number(args[2]) : 60
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            const image = await jimp.read(current)
            image.color([{apply: "mix", params: [color, opacity]}])
            let newDest = path.join(__dirname, `../../images/${seed}_tint`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        invert.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            let current: string
            if (this.historyIndex < 0) {
                current = this.original
            } else {
                current = this.historyStates[this.historyIndex]
            }
            const image = await jimp.read(current)
            image.invert()
            let newDest = path.join(__dirname, `../../images/${seed}_invert`)
            let i = 0
            while (fs.existsSync(`${newDest}.jpg`)) {
                newDest = `${newDest}${i}`
                i++
            }
            await image.writeAsync(`${newDest}.jpg`)
            const newEmbed = await this.hsvEmbed(`${newDest}.jpg`)
            msg.edit(newEmbed)
        })

        undo.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            this.historyIndex--
            let current = this.historyStates[this.historyIndex]
            if (!current) {
                current = this.original
                this.historyIndex = -1
            }
            const newEmbed = await this.hsvEmbed(current, true)
            msg.edit(newEmbed)
        })

        redo.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            this.historyIndex++
            let current = this.historyStates[this.historyIndex]
            if (!current) {
                this.historyIndex = this.historyStates.length - 1
                current = this.historyStates[this.historyIndex]
                if (!current) {
                    current = this.original
                    this.historyIndex = -1
                }
            }
            const newEmbed = await this.hsvEmbed(current, true)
            msg.edit(newEmbed)
        })

        reset.on("collect", async (reaction, user) => {
            await reaction.users.remove(user)
            this.historyIndex = -1
            const newEmbed = await this.hsvEmbed(this.original, true)
            msg.edit(newEmbed)
        })

    }
}

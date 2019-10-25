import {Message, MessageEmbed} from "discord.js"
import * as blacklist from "../../blacklist.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"

const nhentai = require("nhentai-js")

export default class $nHentai extends Command {
    private readonly embeds = new Embeds(this.discord, this.message)
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Searches a doujinshi on nhentai.",
            aliases: [],
            cooldown: 3
        })
    }

    // nhentai Doujin
    public getNhentaiDoujin = (doujin: any, tag: string) => {
        const checkArtists = doujin.details.artists ? Functions.checkChar(doujin.details.artists.join(" "), 50, ")") : "None"
        const checkCharacters = doujin.details.characters ? Functions.checkChar(doujin.details.characters.join(" "), 50, ")") : "None"
        const checkTags = doujin.details.tags ? Functions.checkChar(doujin.details.tags.join(" "), 50, ")") : "None"
        const checkParodies = doujin.details.parodies ? Functions.checkChar(doujin.details.parodies.join(" "), 50, ")") : "None"
        const checkGroups = doujin.details.groups ? Functions.checkChar(doujin.details.groups.join(" "), 50, ")") : "None"
        const checkLanguages = doujin.details.languages ? Functions.checkChar(doujin.details.languages.join(" "), 50, ")") : "None"
        const checkCategories = doujin.details.categories ? Functions.checkChar(doujin.details.categories.join(" "), 50, ")") : "None"
        const star = this.discord.getEmoji("star")
        const doujinPages: MessageEmbed[] = []
        /*fs.mkdirSync(`../assets/pages/${tag}/`);
        fs.mkdirSync(`../assets/pagesCompressed/${tag}/`);
        let msg1 = await message.channel.send(`**Downloading images** ${discord.getEmoji("gabCircle")}`);
        await discord.downloadPages(doujin.pages, `../assets/pages/${tag}/`);
        msg1.delete(1000);
        let msg2 = await message.channel.send(`**Compressing images** ${discord.getEmoji("gabCircle")}`);
        await discord.compressImages(`../assets/pages/${tag}/*.jpg`, `../assets/pagesCompressed/${tag}/`);
        msg2.delete(1000);*/
        for (let i = 0; i < doujin.pages.length; i++) {
            const nhentaiEmbed = this.embeds.createEmbed()
            nhentaiEmbed
            .setAuthor("nhentai", "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg")
            .setTitle(`**${doujin.title}** ${this.discord.getEmoji("chinoSmug")}`)
            .setURL(doujin.link)
            .setDescription(
            `${star}_Japanese Title:_ **${doujin.nativeTitle}**\n` +
            `${star}_ID:_ **${tag}**\n` +
            `${star}_Artists:_ ${checkArtists}\n` +
            `${star}_Characters:_ ${checkCharacters}\n` +
            `${star}_Tags:_ ${checkTags} ${checkParodies}` +
            `${checkGroups} ${checkLanguages} ${checkCategories}\n`
            )
            // .attachFiles([`../assets/pagesCompressed/${tag}/page${i}.jpg`])
            // .setImage(`attachment://page${i}.jpg`)
            .setThumbnail(doujin.thumbnails[0])
            .setImage(doujin.pages[i])
            doujinPages.push(nhentaiEmbed)
        }
        this.embeds.createReactionEmbed(doujinPages, true)
    }

    public nhentaiRandom = async (filter?: boolean) => {
        let random = "0"
        while (!await nhentai.exists(random)) {
            random = Math.floor(Math.random() * 1000000).toString()
        }
        const doujin = await nhentai.getDoujin(random)
        if (filter) {
            for (const i in doujin.details.tags) {
                for (let j = 0; j < blacklist.nhentai.length; j++) {
                    if (doujin.details.tags[i] === blacklist.nhentai[j]) {
                        await this.nhentaiRandom(true)
                    }
                }
            }
        }
        return doujin
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        if (!perms.checkNSFW()) return

        if (!args[1]) {
            const doujin = await this.nhentaiRandom(true)
            this.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g))
            return
        } else {

            if (args[1].toLowerCase() === "random") {
                const doujin = await this.nhentaiRandom(false)
                this.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g))
                return
            }

            const tag = Functions.combineArgs(args, 1)
            if (tag.match(/\d+/g) !== null) {
                const doujin = await nhentai.getDoujin(tag.match(/\d+/g)!.toString())
                this.getNhentaiDoujin(doujin, tag.match(/\d+/g)!.toString())
            } else {
                const result = await nhentai.search(tag)
                if (!result.results[0]) {
                    const nHentaiEmbed = this.embeds.createEmbed()
                    .setAuthor("nhentai", "https://pbs.twimg.com/profile_images/733172726731415552/8P68F-_I_400x400.jpg")
                    .setTitle(`**nHentai Search** ${this.discord.getEmoji("chinoSmug")}`)
                    return this.invalidQuery(nHentaiEmbed, "Try searching on the [**nhentai Website**](https://nhentai.net/).")
                }
                const index = Math.floor(Math.random() * (result.results.length - result.results.length/2) + result.results.length/2)
                const book = result.results[index]
                const doujin = await nhentai.getDoujin(book.bookId)
                this.getNhentaiDoujin(doujin, book.bookId)
            }
        }
    }
}

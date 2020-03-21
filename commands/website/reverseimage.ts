import {Message, MessageEmbed} from "discord.js"
import osmosis from "osmosis"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class ReverseImage extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Reverse image searches an image, avatar, or guild icon.",
            help:
            `
            _Note:_ If no image is found, it defaults to your avatar.
            \`reverseimage\` - Reverse searches the last sent image.
            \`reverseimage url\` - Reverse searches the image from the url.
            \`reverseimage @user/id\` - Reverse searches the user's avatar.
            \`reverseimage guild\` - Reverse searches the guild's icon.
            \`reverseimage me\` - Reverse searches your avatar.
            `,
            examples:
            `
            \`=>reverseimage\`
            \`=>reverseimage https://i.imgur.com/Dt2KANz.jpg\`
            \`=>reverseimage guild\`
            `,
            aliases: ["revimg", "reverseimg"],
            random: "none",
            cooldown: 10
        })
    }

    public revSearch = async (image: string) => {
        const data: any[] = []
        const data2: any[] = []
        const data3: any[] = []
        await new Promise((resolve) => {
            osmosis.get(`https://www.google.com/searchbyimage?image_url=${image}`)
            .find("div:nth-child(4) > div > div > div > div > div.r > a")
            .set({url: "@href", title: "h3"})
            .data(function(d) {
                data.push(d)
                resolve()
            })
        })
        await new Promise((resolve) => {
            osmosis.get(`https://www.google.com/searchbyimage?image_url=${image}`)
            .find("div:nth-child(4) > div > div > div > div > div.s > div > div > a")
            .set({image: "@href"})
            .data(function(d) {
                d.image = d.image.match(/(?<=imgurl=)(.*?)(jpg)/) ? d.image.match(/(?<=imgurl=)(.*?)(jpg)/)[0] : ""
                data2.push(d)
                resolve()
            })
        })
        await new Promise((resolve) => {
            osmosis.get(`https://www.google.com/searchbyimage?image_url=${image}`)
            .find("div:nth-child(4) > div > div > div > div > div.s > div")
            .set({desc: "span"})
            .data(function(d) {
                data3.push(d)
                resolve()
            })
        })
        const newArray: any[] = []
        for (let i = 0; i < data.length; i++) {
            const obj = {} as any
            obj.url = data[i].url
            obj.title = data[i].title
            obj.image = data2[i].image
            obj.desc = data3[i].desc ? data[3].desc : "None"
            newArray.push(obj)
        }
        return newArray
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        let image: string | undefined | null
        if (!args[1]) {
            image = await discord.fetchLastAttachment(message)
        } else if (args[1] === "guild") {
            image = message.guild?.iconURL({format: "png", dynamic: true})
        } else if (args[1] === "me") {
            image = message.author.displayAvatarURL({format: "png", dynamic: true})
        } else if (args[1].match(/\d{17,}/)) {
            const user = message.guild?.members.cache.find((m) => m.id === args[1].match(/\d{17,}/)![0])
            if (user) {
                image = user?.user.displayAvatarURL({format: "png", dynamic: true})
            } else {
                image = args[1]
            }
        } else {
            image = args[1]
        }

        if (!image) image = message.author.displayAvatarURL({format: "png", dynamic: true})
        const result = await Functions.promiseTimeout(10000, this.revSearch(image))
        .catch(() => {
            const revEmbed = embeds.createEmbed()
            .setAuthor("reverse image search", "https://cdn3.iconfinder.com/data/icons/digital-and-internet-marketing-1/130/22-512.png", "https://images.google.com/")
            .setTitle(`**Google Reverse Image Search** ${discord.getEmoji("gabSip")}`)
            .setURL(`https://www.google.com/searchbyimage?image_url=${image}`)
            .setThumbnail(image!)
            .setDescription(
                `${discord.getEmoji("star")}Sorry, but no results were found. [**Here**](https://www.google.com/searchbyimage?image_url=${image}) is a direct link to the search.`
            )
            return message.channel.send(revEmbed)
        }) as any

        const revArray: MessageEmbed[] = []
        for (let i = 0; i < result.length; i++) {
            const revEmbed = embeds.createEmbed()
            revEmbed
            .setAuthor("reverse image search", "https://cdn3.iconfinder.com/data/icons/digital-and-internet-marketing-1/130/22-512.png", "https://images.google.com/")
            .setTitle(`**Google Reverse Image Search** ${discord.getEmoji("gabSip")}`)
            .setURL(`https://www.google.com/searchbyimage?image_url=${image}`)
            .setThumbnail(image!)
            .setImage(result[i].image)
            .setDescription(
                `${discord.getEmoji("star")}_Title:_ **${result[i].title}**\n` +
                `${discord.getEmoji("star")}_Link:_ ${result[i].url}\n` +
                `${discord.getEmoji("star")}_Description:_ ${result[i].desc}\n`
            )
            revArray.push(revEmbed)
        }

        if (revArray.length === 1) {
            message.channel.send(revArray[0])
        } else {
            embeds.createReactionEmbed(revArray, true, true)
        }
    }
}

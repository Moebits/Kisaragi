import axios from "axios"
import {Message} from "discord.js"
import * as config from "../../config.json"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Screenshot extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Posts a website screenshot.",
          help:
            `
            \`screenshot url\` - Posts the screenshot of the webpage
            \`screenshot mobile url\` - Posts the screenshot of the mobile version of the site
            `,
          examples:
            `
            \`=>screenshot https://www.youtube.com/c/Tenpi\`
            \`=>screenshot mobile https://www.youtube.com/c/Tenpi\`
            `,
          aliases: ["screencap"],
          cooldown: 15,
          nsfw: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!perms.checkNSFW()) return

        let input = (args[1] === "return") ? Functions.combineArgs(args, 2) : Functions.combineArgs(args, 1)
        let setMobile = false
        if (/mobile/.test(input)) {
          setMobile = true
          input = input.replace("mobile", "").trim()
        }
        const website = (input.startsWith("http")) ? input.trim() : `https://${input.trim()}`
        let url = `${config.imagesAPI}/screenshot?links=${website}`
        if (setMobile) url += `&mobile=1`

        const link = await axios.get(url).then((r) => r.data?.[0])
        if (!link) return message.reply("Could not find this webpage!")
        if (args[1] === "return") return link

        const screenEmbed = embeds.createEmbed()
        screenEmbed
        .setAuthor({name: "google chrome", iconURL: "https://cdn.pixabay.com/photo/2016/04/13/14/27/google-chrome-1326908_960_720.png"})
        .setTitle(`**Website Screenshot** ${discord.getEmoji("KannaXD")}`)
        .setImage(link)
        message.channel.send({embeds: [screenEmbed]})
  }
}

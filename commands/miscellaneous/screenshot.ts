import {Message, MessageAttachment} from "discord.js"
import puppeteer from "puppeteer"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Screenshot extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
      const embeds = new Embeds(discord, message)

      const input = (args[1] === "return") ? Functions.combineArgs(args, 2) : Functions.combineArgs(args, 1)

      const website = (input.startsWith("http")) ? input.trim() : `http://${input.trim}`

      const browser = await puppeteer.launch({
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbo",
            "--disable-dev-shm-usage"
          ]
        })
      const page = await browser.newPage()
      await page.goto(website)
      await page.screenshot({path: "../assets/images/screenshot.png", omitBackground: true, clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 720
      }})
      await browser.close()
      if (args[1] === "return") return

      const attachment = new MessageAttachment("../assets/images/screenshot.png")
      const screenEmbed = embeds.createEmbed()
      screenEmbed
      .setAuthor("google chrome", "https://cdn.pixabay.com/photo/2016/04/13/14/27/google-chrome-1326908_960_720.png")
      .setTitle(`**Website Screenshot** ${discord.getEmoji("kannaXD")}`)
      .attachFiles([attachment])
      .setImage("attachment://screenshot.png")
      message.channel.send(screenEmbed)
  }
}

import {Message} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class TOS extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "Terms of service for the bot.",
          help:
          `
          \`tos\` - Terms of service
          `,
          examples:
          `
          \`=>tos\`
          `,
          aliases: ["termsofservice"],
          random: "none",
          cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const termsOfService = embeds.createEmbed()
        termsOfService
        .setAuthor("tos", "https://www.symphonyenvironmental.com/wp-content/uploads/2019/10/Terms-and-conditions-icon-V2.png")
        .setTitle(`**Terms of Service** ${discord.getEmoji("kannaPat")}`)
        .setDescription(Functions.multiTrim(`
            By using Kisaragi, you **agree** to abide by the terms of service. Kisaragi is a bot on Discord meant to enhance your experience by adding a lot of features that Discord does not provide.
            **Bot Spam and Misuse**
            ${discord.getEmoji("star")}_Content:_ Everything posted by the bot falls under your responsibility, not the bot or developer. If the bot posts something "questionable" it's because of the input you gave it. I do make an effort to filter such content, but it's impossible to filter everything on the internet.
            ${discord.getEmoji("star")}_API Spam:_ Don't use this bot to spam Discord's API (or any API it uses). Don't abuse commands that function on other commands (chain, random).
            ${discord.getEmoji("star")}_Global Chat:_ Don't post anything inappropriate, offensive, or spam. This is a public chat visible to everyone who enables it.
            ${discord.getEmoji("star")}_Oauth2:_ Don't abuse oauth2 commands or share oauth2 links created by the bot.
            ${discord.getEmoji("star")}_Abusing Bugs:_ This bot is a beta version, and there could be bugs that crash the bot. Please report these bugs with the \`feedback\` command.
            **Punishment**
            Violating the TOS could result in you or your entire guild getting blacklisted (blocked from using any commands and blocked from adding the bot to a server).
            **Appeal**
            There is no method of appealing yet, because I don't think it's necessary.
        `))
        return message.channel.send(termsOfService)
    }
}

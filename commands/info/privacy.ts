import {Message} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Privacy extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
          description: "This is the privacy policy of the bot.",
          help:
          `
          \`privacy\` - Privacy policy
          `,
          examples:
          `
          \`=>privacy\`
          `,
          aliases: ["about"],
          random: "none",
          cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const privacyPolicy = embeds.createEmbed()
        privacyPolicy
        .setAuthor("privacy policy", "https://digitalchamber.org/wp-content/uploads/2020/01/policy-initiatives-icon-blue-blockchain-alliance.png")
        .setTitle(`**Privacy Policy** ${discord.getEmoji("kannaPat")}`)
        .setDescription(Functions.multiTrim(`
            By adding Kisaragi to your server, or by authorizing her with oauth2, every member in the server automatically **agrees** to this privacy policy. If this is not the case, leave the server or remove the bot.
            **Public Information**
            ${discord.getEmoji("star")}_Guilds:_ The bot can access all of the public information of every guild that she is on, including but not limited to: guild name, members, roles, channels, and emojis.
            This is part of the basic functionality of every command, such as posting a message in a channel or knowing who invoked a command.
            **Private Information (Oauth2 Only)**
            ${discord.getEmoji("star")}_Email Address:_ Your discord email address is used to send you email from the \`email\` command. This is to verify that the address belongs to you, and also to protect your privacy by not having to write your email when invoking the command.
            ${discord.getEmoji("star")}_Connections:_ Access to your connections is required to verify that a social media account belongs to you (such as twitter).
            ${discord.getEmoji("star")}_Twitter Write Access:_ If you authenticate with your twitter account, it gives the bot public read and write access over your account. The bot only posts tweets requested on your behalf from the \`tweet\` command.
            ${discord.getEmoji("star")}_Joining Servers:_ Any server admin will be able to add you onto their server with the \`add\` command as long as they know your user id or tag. You are always notified
            when this occurs.
            **Delete Information**
            ${discord.getEmoji("star")}_Data Deletion:_ Use the commands \`oauth2 revoke\` and \`twitteroauth delete\` to delete your discord and twitter oauth data, respectively. To revoke your twitter
            token you need to manually click on "revoke access" in your application settings. To delete all guild data, just remove the bot from your server.
            ${discord.getEmoji("star")}_Account Deletion:_ If you delete your discord account all user-specific settings and oauth2 data on your account is deleted.
            _Note: This privacy policy is intentionally short because of character limits._
        `))
        return message.channel.send(privacyPolicy)
    }
}

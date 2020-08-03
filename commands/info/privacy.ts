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
          description: "Privacy policy of the bot.",
          help:
          `
          \`privacy\` - Privacy policy
          `,
          examples:
          `
          \`=>privacy\`
          `,
          aliases: ["privacypolicy"],
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
        .setURL("https://kisaragi-site.herokuapp.com/privacy")
        .setTitle(`**Privacy Policy** ${discord.getEmoji("kannaPat")}`)
        .setDescription(Functions.multiTrim(`
            By adding Kisaragi to your server, or by authorizing her with oauth2, every member in the server automatically **agrees** to this privacy policy. Otherwise, kick the bot or leave the server. Your information is not shared.
            **Public Information**
            ${discord.getEmoji("star")}_Guilds:_ The bot collects public information of every guild that she is on, including but not limited to: guild name, members, roles, channels, and emojis.
            This is required for bot functionality.
            **Private Information (Oauth2 Only)**
            ${discord.getEmoji("star")}_Email Address:_ Your discord email address is used to send you email from the \`email\` command. This is to verify that the address belongs to you, and also to protect your privacy by not having to write your email when invoking the command.
            ${discord.getEmoji("star")}_Connections:_ Access to your connections is required to verify that a social media account belongs to you (such as twitter).
            ${discord.getEmoji("star")}_Account Access:_ If you authenticate with a social media account, it gives the bot public read and write access over your account. The bot only does actions on your behalf.
            ${discord.getEmoji("star")}_Joining Servers:_ Any server admin will be able to add you onto their server with the \`add\` command as long as they know your user id or tag. You are always notified
            when this occurs.
            **Delete Information**
            ${discord.getEmoji("star")}_Data Deletion:_ All oauth commands have an option to revoke your token. To revoke your twitter
            token you need to manually click on "revoke access" in your application settings. To delete all guild data, just remove the bot from your server.
            ${discord.getEmoji("star")}_Account Deletion:_ If you delete your discord account all user-specific settings and oauth2 data on your account is deleted.
        `))
        return message.channel.send(privacyPolicy)
    }
}

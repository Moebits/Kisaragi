import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Detector} from "./../../structures/Detector"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class GlobalBan extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Bans a user from all of the guilds that Kisaragi is in.",
            help:
            `
            \`globalban @user/id reason?\` - Globally bans the user
            `,
            examples:
            `
            \`=>globalban @user raider\`
            `,
            guildOnly: true,
            aliases: ["gban"],
            cooldown: 10,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        if (!perms.checkBotDev()) return
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const user = Functions.combineArgs(args, 1).match(/\d+/g)
    }
}

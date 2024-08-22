import {Message} from "discord.js"
import fs from "fs"
import path from "path"
import {Command} from "../../structures/Command"
import {Generate} from "./../../structures/Generate"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "./../../structures/Permission"
import {PixivApi} from "./../../structures/PixivApi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Test extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "For general tests.",
            aliases: [],
            cooldown: 3,
            unlist: true
        })
    }

    public run = async (args: string[]) => {
        const message = this.message
        const discord = this.discord
        const pixiv = new PixivApi(discord, message)
        const perms = new Permission(discord, message)
        if (!perms.checkBotDev()) return

        const g = discord.guilds.cache.get(args[1])
        if (!g) return message.reply("Not in this server")
        const msg = await discord.fetchFirstMessage(g!)
        if (!msg) return message.reply("Can't fetch the message")
        await SQLQuery.initGuild(msg, true)
        /*const generate = new Generate(discord, message)
        const str = generate.generateCommands()
        const dest = path.join(__dirname, "../../../assets/misc/dump/commands.md")
        fs.writeFileSync(dest, str)
        const attachment = new MessageAttachment(dest)*/

        // await pixiv.animeEndpoint("all")
        // await message.channel.send(attachment)
        await message.channel.send("done")
    }
}

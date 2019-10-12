import {Guild, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Clean extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const sql = new SQLQuery(message)
        const perms = new Permission(discord, message)
        if (!perms.checkBotDev()) return

        const guildID = args[1]
        const guild = discord.guilds.find((g: Guild) => g.id.toString() === guildID) as Guild

        try {
            guild.delete()
        } catch (err) {
            console.log(err)
        } finally {
            await sql.deleteGuild(guildID)
        }
    }
}

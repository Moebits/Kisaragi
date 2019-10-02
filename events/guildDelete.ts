import {Guild, Message} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildDelete {
    public discord: Kisaragi
    constructor(discord: Kisaragi) {
        this.discord = discord
    }

    public run = async (guild: Guild) => {
        const sql = new SQLQuery(await this.discord.fetchFirstMessage(guild) as Message)
        sql.deleteGuild(guild.id)
    }
}

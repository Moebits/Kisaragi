import {Guild, Message} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"
import {SQLQuery} from "./../structures/SQLQuery"

export default class GuildCreate {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (guild: Guild) => {
        const sql = new SQLQuery(await this.discord.fetchFirstMessage(guild) as Message)
        sql.initGuild()
    }
}

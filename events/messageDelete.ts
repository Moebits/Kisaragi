import {Message} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"
export default class MessageDelete {
    constructor(private readonly discord: Kisaragi) {}

    public run = async (message: Message) => {
        if (message.partial) message = await message.fetch()
        // log deleted
    }
}

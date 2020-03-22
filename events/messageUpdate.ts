import {Message} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"
export default class MessageUpdate {
    constructor(private readonly discord: Kisaragi) {}

    public run = (message: Message) => {
        // log updated
    }
}

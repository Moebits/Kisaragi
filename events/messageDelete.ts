import {Message} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"

export default class MessageDelete {
    constructor(private readonly discord: Kisaragi) {}

    public run = (message: Message) => {
        // log deleted
        console.log(this.discord)
    }
}

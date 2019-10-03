import {MessageReaction} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"

const active = new Set()

export default class MessageReactionRemove {
    constructor(private readonly discord: Kisaragi) {}

    public run = (reaction: MessageReaction) => {
        // nothing here lol
        console.log(this.discord)
        console.log(active)
    }
}

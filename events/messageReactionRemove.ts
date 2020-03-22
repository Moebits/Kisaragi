import {MessageReaction} from "discord.js"
import {Kisaragi} from "./../structures/Kisaragi"

export default class MessageReactionRemove {
    constructor(private readonly discord: Kisaragi) {}

    public run = (reaction: MessageReaction) => {
        //
    }
}

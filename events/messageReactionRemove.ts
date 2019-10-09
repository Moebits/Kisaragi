import {MessageReaction} from "discord.js"

const active = new Set()

export default class MessageReactionRemove {
    constructor() {
        //
    }

    public run = (reaction: MessageReaction) => {
        active.has("hi")
    }
}

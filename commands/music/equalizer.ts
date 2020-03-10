import {Message} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Equalizer extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Changes the volume of specific frequencies.",
            help:
            `
            \`equalizer\` - Open the equalizer
            `,
            examples:
            `
            \`=>equalizer\`
            `,
            aliases: ["eq"],
            cooldown: 5
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)

        const player = message.guild?.voice?.connection?.dispatcher
        if (!player) return message.reply(`It seems as if you aren't playing any audio ${discord.getEmoji("kannaCurious")}`)
        const dest = `./tracks/eq.mp3`

        return
    }
}

import {Message, SlashCommandBuilder, SlashCommandStringOption} from "discord.js"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Audio} from "./../../structures/Audio"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Effects extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Opens the effects menu.",
            help:
            `
            \`effects\` - Opens the effects menu.
            `,
            examples:
            `
            \`=>effects\`
            `,
            aliases: ["fx"],
            guildOnly: true,
            cooldown: 20,
            slashEnabled: true
        })
        this.slash = new SlashCommandBuilder()
            .setName(this.constructor.name.toLowerCase())
            .setDescription(this.options.description)
            .toJSON()
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const audio = new Audio(discord, message)
        const perms = new Permission(discord, message)
        if (!audio.checkMusicPermissions()) return
        if (!audio.checkMusicPlaying()) return
        const loading = message.channel.lastMessage
        loading?.delete()
        const msg = await audio.fxMenu()
        msg.delete()
        const queue = audio.getQueue() as any
        const embed = await audio.updateNowPlaying()
        queue[0].message.edit(embed)
        message.delete().catch(() => null)
        return
    }
}

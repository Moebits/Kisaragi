import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Detector} from "./../../structures/Detector"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Swap extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Swaps all members to a weeb or normie role.",
            help:
            `
            \`swap\` - Swaps all members to the weeb or normie role.
            `,
            examples:
            `
            \`=>swap\`
            `,
            guildOnly: true,
            aliases: [],
            cooldown: 10
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const detect = new Detector(discord, message)
        if (!await perms.checkAdmin()) return
        const pfp = await sql.fetchColumn("detection", "pfp")
        const weeb = await sql.fetchColumn("detection", "weeb")
        const normie = await sql.fetchColumn("detection", "normie")
        if (!pfp || pfp === "off") return message.reply("Cannot use this command, have not set the weeb and normie roles!")
        let weebCounter = 0
        let normieCounter = 0

        const wait = await message.channel.send(`**Scanning every member in the server. This will take awhile** ${discord.getEmoji("gabCircle")}`)

        for (let i = 0; i < message.guild!.members.cache.size; i++) {
            const memberArray = message.guild!.members.cache.map((m: GuildMember) => m)
            const result = await detect.swapRoles(memberArray[i], true)
            if (result === true) {
                weebCounter += 1
            } else if (result === false) {
                normieCounter += 1
            }
        }

        await wait.delete({timeout: 1000})
        const swapEmbed = embeds.createEmbed()
        swapEmbed
        .setTitle(`**Role Swapping** ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${discord.getEmoji("star")}**${weebCounter}** members were swapped into the <@&${weeb}> role.\n` +
            `${discord.getEmoji("star")}**${normieCounter}** members were swapped into the <@&${normie}> role.\n`
        )
        message.channel.send(swapEmbed)
    }
}

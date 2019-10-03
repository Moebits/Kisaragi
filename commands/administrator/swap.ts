import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Detector} from "./../../structures/Detector"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class Swap extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permissions(discord, message)
        const embeds = new Embeds(discord, message)
        const sql = new SQLQuery(message)
        const detect = new Detector(discord)
        const star = discord.getEmoji("star")
        if (await perms.checkAdmin(message)) return
        const pfp = await sql.fetchColumn("detection", "pfp")
        const weeb = await sql.fetchColumn("detection", "weeb")
        const normie = await sql.fetchColumn("detection", "normie")
        if (pfp.join("") === "off") return
        let weebCounter = 0
        let normieCounter = 0

        const wait = await message.channel.send(`**Scanning every member in the server. This will take awhile** ${discord.getEmoji("gabCircle")}`)

        for (let i = 0; i < message.guild!.members.size; i++) {
            const memberArray = message.guild!.members.map((m: GuildMember) => m)
            const result = await detect.swapRoles(message, memberArray[i], true)
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
            `${star}**${weebCounter}** members were swapped into the <@&${weeb.join("")}> role.\n` +
            `${star}**${normieCounter}** members were swapped into the <@&${normie.join("")}> role.\n`
        )
        message.channel.send(swapEmbed)
    }
}

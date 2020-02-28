import {GuildChannel, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class CreateGuild extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Creates a new guild.",
            aliases: [],
            cooldown: 3
        })
    }

    public createGuild = async (discord: Kisaragi, message: Message, guildName: string, guildRegion: string) => {
        const perms = new Permission(discord, message)
        if (!perms.checkBotDev()) return

        try {
            const guild = await discord.guilds.create(guildName, {region: guildRegion, icon: null})
            const defaultChannel = guild.channels.cache.find((channel: GuildChannel) => channel.permissionsFor(guild.me!)!.has("SEND_MESSAGES"))
            const invite = await defaultChannel!.createInvite()
            await message.author!.send(invite.url)
            const role = await guild.roles.create({data: {name: "Administrator", permissions: ["ADMINISTRATOR"]}})
            await message.author!.send(role.id)
            await message.channel.send(`I made a guild! The invite is ${invite.url} The Administrator role ID is ${role.id}.`)

        } catch (error) {
            discord.cmdError(message, error)
        }
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const guildName: string = args[1]
        const guildRegion: string = args[2]

        await this.createGuild(discord, message, guildName, guildRegion)
    }
}

import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class CreateGuild extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public createGuild = async (discord: any, message: any, guildName: string, guildRegion: string) => {
        const perms = new Permissions(discord, message)
        if (perms.checkBotDev(message)) return

        try {
            const guild: any = await discord.user.createGuild(guildName, guildRegion)
            const defaultChannel: any = guild.channels.find((channel: any) => channel.permissionsFor(guild.me).has("SEND_MESSAGES"))
            const invite: any = await defaultChannel.createInvite()
            await message.author.send(invite.url)
            const role: any = await guild.createRole({name: "Administrator", permissions: ["ADMINISTRATOR"]})
            await message.author.send(role.id)
            await message.channel.send(`I made a guild! The invite is ${invite.url} The Administrator role ID is ${role.id}.`)

        } catch (error) {
            discord.cmdError()
        }
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {

    const guildName: string = args[1]
    const guildRegion: string = args[2]

    await this.createGuild(discord, message, guildName, guildRegion)
    }
}

import {GuildChannel, Message, TextChannel} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import {Command} from "../../structures/Command"
import {Permission} from "../../structures/Permission"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class CreateGuild extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
            description: "Creates a new guild.",
            aliases: ["cg"],
            cooldown: 3,
            nsfw: true
        })
    }

    public createGuild = async (discord: Kisaragi, message: Message<true>, guildName: string) => {
        const perms = new Permission(discord, message)
        if (!perms.checkBotDev()) return

        try {
            const guild = await discord.guilds.create({name: guildName, icon: null})
            const defaultChannel = guild.channels.cache.find((c)=>c.name === "general")
            const invite = await (defaultChannel as TextChannel)!.createInvite()
            const role = await guild.roles.create({name: "Administrator", permissions: ["Administrator"]})
            await message.channel.send(`I made a guild! The invite is ${invite.url} The Administrator role ID is ${role.id}.`)

        } catch (error: any) {
            discord.cmdError(message, error)
        }
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message

        const guildName: string = args[1]

        await this.createGuild(discord, message, guildName)
    }
}

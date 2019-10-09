import {GuildMember, Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"

export default class Role extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
      const embeds = new Embeds(discord, message)
      const perms = new Permissions(discord, message)
      if (await perms.checkMod(message)) return

      const roleEmbed = embeds.createEmbed()

      if ((!args[3]) || (message.mentions.members!.size === 0)) {
        return message.channel.send(roleEmbed
          .setDescription("You must type =>role <add or del> [user] [role]"))

      } else {

          const member: GuildMember = message.mentions.members!.first()!
          const roleName: string = args[3]
          const snowflake: RegExp = /\d+/
          let roleID: string = roleName.substring(roleName.search(snowflake))
          if (roleID.includes(">")) roleID = roleID.slice(0, -1)
          const role = message.guild!.roles.get(roleID)

          switch (args[1]) {

            case "add": {
                try {
                  await member.roles.add(role!)
                  await message.channel.send(roleEmbed
                    .setDescription(`${member.displayName} now has the ${role} role!`))
                } catch (error) {
                  discord.cmdError(message, error)
                  message.channel.send(roleEmbed
                    .setDescription(`The role **${roleName}** could not be found.`))
                }
                break
            }

            case "del": {
              try {
                await member.roles.remove(role!)
                await message.channel.send(roleEmbed
                  .setDescription(`${member.displayName} no longer has the ${role} role!`))
              } catch (error) {
                discord.cmdError(message, error)
                message.channel.send(roleEmbed
                  .setDescription(`The role **${roleName}** could not be found.`))
              }
            }
            default:
          }
      }

  }
}

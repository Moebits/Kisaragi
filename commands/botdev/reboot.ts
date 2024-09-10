import child_process from "child_process"
import {Message} from "discord.js"
import {SlashCommandOption} from "../../structures/SlashCommandOption"
import fs from "fs"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"

export default class Reboot extends Command {
    constructor(discord: Kisaragi, message: Message<true>) {
        super(discord, message, {
          description: "Reboots the bot.",
          aliases: ["restart"],
          cooldown: 100,
          botdev: true
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return

        const subDir = fs.readdirSync("commands")
        for (let i = 0; i < subDir.length; i++) {
          const commands = fs.readdirSync(`commands/${subDir[i]}`)
          for (let j = 0; j < commands.length; j++) {
            delete require.cache[require.resolve(`../${subDir[i]}/${commands[j]}`)]
          }
        }

        const loading = message.channel.lastMessage
        await loading?.delete()

        const rebootEmbed = embeds.createEmbed()
        .setTitle(`**Reboot** ${discord.getEmoji("gabStare")}`)
        .setDescription("Rebooting bot!")

        await message.channel.send({embeds: [rebootEmbed]})
        child_process.execSync("cd ../ && npm run build")
        process.exit(0)
      }
    }

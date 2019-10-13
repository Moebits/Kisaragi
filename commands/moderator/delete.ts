import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"

export default class Delete extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Deletes messages.",
            aliases: ["del", "prune", "purge"],
            cooldown: 3
        })
    }

    public bulkDelete = async (num: number, message: Message, userID: boolean, search: boolean, args: string[], query: string) => {
        const msgArray: string[] = []
        if (userID) {
            const messages = await message.channel.messages.fetch({limit: num}).then((c) => c.map((m: Message) => m))
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].author!.id === args[2].match(/\d+/g)!.join("")) {
                    msgArray.push(messages[i].id)
                }
            }
            await message.channel.bulkDelete(msgArray, true)
        } else if (search) {
            const messages = await message.channel.messages.fetch({limit: num}).then((c) => c.map((m: Message) => m))
            for (let i = 0; i < messages.length; i++) {
                if (messages[i].embeds[0] ?
                (messages[i].embeds[0].description ? messages[i].embeds[0].description.toLowerCase().includes(query.trim().toLowerCase()) : false)
                : messages[i].content.toLowerCase().includes(query.trim().toLowerCase())) {
                    msgArray.push(messages[i].id)
                }
            }
            await message.channel.bulkDelete(msgArray, true)
        } else {
            await message.channel.bulkDelete(num, true)
        }
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const embeds = new Embeds(discord, message)
        const perms = new Permission(discord, message)
        if (!await perms.checkMod()) return
        const delEmbed = embeds.createEmbed()
        const num: number = Number(args[1]) + 2
        let userID = false
        let search = false
        let query = ""
        if (args[2]) {
            if (args[2].match(/\d+/g)) {
                userID = true
            } else {
                query = Functions.combineArgs(args, 2)
                search = true
            }
        }

        if (!num) {
            delEmbed
            .setDescription("Correct usage is =>del (number).")
            message.channel.send(delEmbed)
            return
        }

        if (num < 2 || num > 1002) {
            delEmbed
            .setDescription("You must type a number between 0 and 1000!")
            message.channel.send(delEmbed)
            return
        }

        if (num <= 100) {
            await this.bulkDelete(num, message, userID, search, args, query)
        } else {
            const iterations = Math.floor(num / 100)
            for (let i = 0; i <= iterations; i++) {
                await this.bulkDelete(100, message, userID, search, args, query)
            }
            await this.bulkDelete(num % 100, message, userID, search, args, query)
        }

        if (userID) {
            try {
                await message.delete()
            } catch (err) {
                console.log(err)
            }
            delEmbed
            .setDescription(`Deleted the last **${args[1]}** messages by <@${args[2].match(/\d+/g)!.join("")}>!`)
        } else if (search) {
            delEmbed
            .setDescription(`Deleted the last **${args[1]}** messages containing **${query}**!`)
        } else {
            delEmbed
            .setDescription(`Deleted **${args[1]}** messages in this channel!`)
        }
        const msg = await message.channel.send(delEmbed) as Message
        msg.delete({timeout: 5000})
        return
    }
}

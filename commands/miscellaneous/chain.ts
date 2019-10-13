import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Chain extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "Run multiple commands, one after another.",
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const commands = new CommandFunctions(discord, message)

        const cmdArgs = args.join(" ").split("& ")
        for (let i = 0; i < cmdArgs.length; i++) {
            const loading = await message.channel.send(`**Running Chain ${i + 1}** ${discord.getEmoji("gabCircle")}`) as Message
            await commands.runCommand(message, cmdArgs[i].replace(/chain/g, "").split(" "))
            loading.delete({timeout: 1000})
        }
    }
}

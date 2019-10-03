import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {CommandFunctions} from "./../../structures/CommandFunctions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Chain extends Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const commands = new CommandFunctions(discord)

        const cmdArgs = args.join(" ").split("& ")
        for (let i = 0; i < cmdArgs.length; i++) {
            const loading = await message.channel.send(`**Running Chain ${i + 1}** ${discord.getEmoji("gabCircle")}`) as Message
            await commands.runCommand(message, cmdArgs[i].replace(/chain/g, "").split(" "))
            loading.delete({timeout: 1000})
        }
    }
}

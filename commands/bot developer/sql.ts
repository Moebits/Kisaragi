import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"
import {Permissions} from "./../../structures/Permissions"
import {SQLQuery} from "./../../structures/SQLQuery"

export default class SQL extends Command {
    constructor(kisaragi: Kisaragi) {
        super({
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const perms = new Permissions(discord, message)
        const embeds = new Embeds(discord, message)
        if (perms.checkBotDev(message)) return
        const query = {text: Functions.combineArgs(args, 1), rowMode: "array"}
        const sqlEmbed = embeds.createEmbed()
        let result
        try {
            result = await SQLQuery.runQuery(query, true)
            console.log(result)
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``)
        }
        sqlEmbed
        .setTitle(`**SQL Query** ${discord.getEmoji("karenAnger")}`)
        .setDescription(`Successfully ran the query **${query.text}**\n` +
        "\n" +
        `**${result ? (result[0][0] ? result[0].length : result.length) : 0}** rows were selected!\n` +
        "\n" +
        `\`\`\`${Functions.checkChar(JSON.stringify(result), 2000, ",")}\`\`\``)
        message.channel.send(sqlEmbed)

    }
}

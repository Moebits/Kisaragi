import {Message} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class Emoji extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)

        const emojiEmbed: any = embeds.createEmbed()
        const emojiName: string = args[1]

        if (!emojiName.includes("<" || ">")) {

            const emojiFound = discord.emojis.find((emoji: any) => emoji.identifier === emojiName)
            if (emojiFound === null) {
                message.channel.send(emojiEmbed
                    .setDescription("Could not find that emoji!"))
                return
            }
            message.channel.send(emojiEmbed
                .setDescription(`**${emojiName} Emoji**`)
                .setImage(`${emojiFound!.url}`))
            return

            }

        const snowflake: RegExp = /\d+/
        let emojiID: string = emojiName.substring(emojiName.search(snowflake))
        if (emojiID.includes(">")) {emojiID = emojiID.slice(0, -1)}

        if (typeof parseInt(emojiID, 10) === "number") {
            const emojiGet: any = discord.emojis.get(emojiID)
            message.channel.send(emojiEmbed
                .setDescription(`**${emojiGet.name} Emoji**`)
                .setImage(emojiGet.url))
            return
        }
    }
}

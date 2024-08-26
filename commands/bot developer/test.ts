import {Message, ButtonBuilder, ButtonStyle, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder} from "discord.js"
import {Command} from "../../structures/Command"
import {Embeds} from "../../structures/Embeds"
import {Kisaragi} from "../../structures/Kisaragi"
import {Permission} from "../../structures/Permission"
import {SQLQuery} from "../../structures/SQLQuery"

export default class Test extends Command {
    constructor(discord: Kisaragi, message: Message) {
        super(discord, message, {
            description: "For testing.",
            aliases: [],
            cooldown: 3,
            unlist: true
        })
    }

    public emojiMap: any = {
        "admin": this.discord.getEmoji("raphiOMG"),
        "anime": this.discord.getEmoji("gabYes"),
        "bot developer": this.discord.getEmoji("no"),
        "config": this.discord.getEmoji("akariLurk"),
        "fun": this.discord.getEmoji("chinoSmug"),
        "game": this.discord.getEmoji("yaoi"),
        "heart": this.discord.getEmoji("kannaPatting"),
        "lewd": this.discord.getEmoji("madokaLewd"),
        "info": this.discord.getEmoji("kannaCurious"),
        "weeb": this.discord.getEmoji("kannaHungry"),
        "level": this.discord.getEmoji("KannaXD"),
        "image": this.discord.getEmoji("tohruSmug"),
        "misc": this.discord.getEmoji("karenXmas"),
        "misc 2": this.discord.getEmoji("sataniaDead"),
        "mod": this.discord.getEmoji("kannaFreeze"),
        "music": this.discord.getEmoji("PoiHug"),
        "music 2": this.discord.getEmoji("yes"),
        "music 3": this.discord.getEmoji("vigneDead"),
        "reddit": this.discord.getEmoji("AquaWut"),
        "twitter": this.discord.getEmoji("gabSip"),
        "video": this.discord.getEmoji("vigneXD"),
        "waifu": this.discord.getEmoji("karenSugoi"),
        "website": this.discord.getEmoji("tohruThumbsUp2"),
        "website 2": this.discord.getEmoji("mexShrug"),
        "website 3": this.discord.getEmoji("think")
    }

    public run = async (args: string[]) => {
        const discord = this.discord
        const message = this.message
        const perms = new Permission(discord, message)
        const sql = new SQLQuery(message)
        const embeds = new Embeds(discord, message)
        if (!perms.checkBotDev()) return

        const style = ButtonStyle.Secondary

        const button = new ButtonBuilder()
            .setCustomId("button1")
            .setStyle(style)
            .setEmoji(discord.getEmoji("right").id)

        const button2 = new ButtonBuilder()
            .setCustomId("button2")
            .setStyle(style)
            .setEmoji(discord.getEmoji("left").id)

        const button3 = new ButtonBuilder()
            .setCustomId("button3")
            .setStyle(style)
            .setEmoji(discord.getEmoji("tripleRight").id)
        
        const button4 = new ButtonBuilder()
            .setCustomId("button4")
            .setStyle(style)
            .setEmoji(discord.getEmoji("tripleLeft").id)
        
        const button5 = new ButtonBuilder()
            .setCustomId("button5")
            .setStyle(style)
            .setEmoji(discord.getEmoji("numberSelect").id)

        const button6 = new ButtonBuilder()
            .setCustomId("button6")
            .setStyle(style)
            .setEmoji(discord.getEmoji("copy").id)
        
        const button7 = new ButtonBuilder()
            .setCustomId("button7")
            .setStyle(style)
            .setEmoji(discord.getEmoji("repost").id)

		const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(button, button2, button3, button4, button5)
		const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(button6, button7)

		await message.reply({components: [row1, row2]})
    }
}

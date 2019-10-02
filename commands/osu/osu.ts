import {Message} from "discord.js"
import {Osu} from "node-osu"
import {Command} from "../../structures/Command"
import {Embeds} from "./../../structures/Embeds"
import {Functions} from "./../../structures/Functions"
import {Kisaragi} from "./../../structures/Kisaragi"

export default class OsuCommand extends Command {
    constructor(kisaragi: Kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        })
    }

    public run = async (discord: Kisaragi, message: Message, args: string[]) => {
        const embeds = new Embeds(discord, message)
        // const axios = require("axios");
        const osu = new Osu.Api(process.env.OSU_API_KEY)
        const osuEmbed = embeds.createEmbed()
        const star = discord.getEmoji("star")

        const playerName = args[1]
        const rawPlayer = await osu.apiCall("/get_user", {u: playerName})
        const player = rawPlayer[0]
        const hours = Math.floor(player.total_seconds_played / 3600)
        const minutes = Math.floor((player.total_seconds_played % (3600*hours)) / 60)
        const seconds = ((player.total_seconds_played % (3600*hours)) % (60*minutes))
        // let rawPage = await axios.get(`https://osu.ppy.sh/users/${player.user_id}`)
        // let image = `https://lemmmy.pw/osusig/sig.php?colour=hexff44d0&uname=${player.username}&pp=1&countryrank&removeavmargin&flagstroke&opaqueavatar&onlineindicator=3&xpbar&xpbarhex`

        // console.log(osuBanner)
        osuEmbed
        .setAuthor("osu", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Osu%21Logo_%282015%29.svg/220px-Osu%21Logo_%282015%29.svg.png")
        .setTitle(`**Osu Profile** ${discord.getEmoji("kannaSip")}`)
        .setURL(`https://osu.ppy.sh/users/${player.user_id}`)
        .setDescription(
        `${star}_Player:_ **${player.username}**\n` +
        `${star}_Join Date:_ **${Functions.formatDate(player.join_date)}**\n` +
        `${star}_Play Time:_ **${hours}h ${minutes}m ${seconds}s**\n` +
        `${star}_Play count:_ **${player.playcount}**\n` +
        `${star}${discord.getEmoji("SSHrank")} **${player.count_rank_ssh}** ${discord.getEmoji("SSrank")}` +
        `**${player.count_rank_ss}** ${discord.getEmoji("SHrank")} **${player.count_rank_sh}** ${discord.getEmoji("Srank")} **${player.count_rank_s}**` +
        `${discord.getEmoji("Arank")} **${player.count_rank_a}**\n` +
        `${star}${discord.getEmoji("300hit")} **${player.count300}** ${discord.getEmoji("100hit")} **${player.count100}**` +
        `${discord.getEmoji("50hit")} **${player.count50}**\n` +
        `${star}_PP:_ **${player.pp_raw}**\n` +
        `${star}_Score:_ **${player.ranked_score} (${player.total_score})**\n` +
        `${star}_Rank:_ **#${player.pp_rank} (:flag_${player.country.toLowerCase()}: #${player.pp_country_rank})**\n` +
        `${star}_Level:_ **${player.level.slice(0, 5)}**\n` +
        `${star}_Accuracy:_ **${player.accuracy.slice(0, 5) + "%"}**\n`
        )
        .setThumbnail(`https://a.ppy.sh/${player.user_id}`)
        message.channel.send(osuEmbed)

    }
}

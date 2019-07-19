exports.run = async (client: any, message: any, args: string[]) => {
    const Osu = require('node-osu');
    //const axios = require("axios");
    let osu = new Osu.Api(process.env.OSU_API_KEY);
    let osuEmbed = client.createEmbed();
    
    let playerName = args[1];
    let player = await osu.apiCall('/get_user', {u: playerName})
    //let rawPage = await axios.get(`https://osu.ppy.sh/users/${player[0].user_id}`)
    //let image = `https://lemmmy.pw/osusig/sig.php?colour=hexff44d0&uname=${player[0].username}&pp=1&countryrank&removeavmargin&flagstroke&opaqueavatar&onlineindicator=3&xpbar&xpbarhex`
    
    //console.log(osuBanner)
    osuEmbed
    .setTitle(`**Osu Profile** ${client.getEmoji("kannaSip")}`)
    .addField("**Player**", player[0].username)
    .addField("**Profile**", `https://osu.ppy.sh/users/${player[0].user_id}`)
    .addField("**Join Date**", client.formatDate(player[0].join_date))
    .addField("**Play Time**", player[0].total_seconds_played)
    .addField("**Play count**", player[0].playcount)
    .addField("**SSH ranks**", player[0].count_rank_ssh, true)
    .addField("**SS ranks**", player[0].count_rank_ss, true)
    .addField("**SH ranks**", player[0].count_rank_sh, true)
    .addField("**S ranks**", player[0].count_rank_s, true)
    .addField("**A ranks**", player[0].count_rank_a, true)
    .addField("**300 Hits**", player[0].count300, true)
    .addField("**100 Hits**", player[0].count100, true)
    .addField("**50 Hits**", player[0].count50, true)
    .addField("**Ranked Score**", player[0].ranked_score, true)
    .addField("**Total Score**", player[0].total_score, true)
    .addField("**PP**", player[0].pp_raw)
    .addField("**Rank**", player[0].pp_rank)
    .addField("**Country Rank**", player[0].pp_country_rank)
    .addField("**Country**", player[0].country)
    .addField("**Level**", player[0].level)
    .addField("**Accuracy**", player[0].accuracy)
    .setThumbnail(`https://a.ppy.sh/${player[0].user_id}`)
    message.channel.send(osuEmbed);
    


    
}
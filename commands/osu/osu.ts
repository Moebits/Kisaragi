exports.run = async (client: any, message: any, args: string[]) => {
    const Osu = require('node-osu');
    //const axios = require("axios");
    let osu = new Osu.Api(process.env.OSU_API_KEY);
    let osuEmbed = client.createEmbed();
    
    let playerName = args[1];
    let rawPlayer = await osu.apiCall('/get_user', {u: playerName});
    let player = rawPlayer[0];
    let hours = Math.floor(player.total_seconds_played / 3600)
    let minutes = Math.floor((player.total_seconds_played % (3600*hours)) / 60)
    let seconds = ((player.total_seconds_played % (3600*hours)) % (60*minutes)) 
    //let rawPage = await axios.get(`https://osu.ppy.sh/users/${player.user_id}`)
    //let image = `https://lemmmy.pw/osusig/sig.php?colour=hexff44d0&uname=${player.username}&pp=1&countryrank&removeavmargin&flagstroke&opaqueavatar&onlineindicator=3&xpbar&xpbarhex`
    
    //console.log(osuBanner)
    osuEmbed
    .setAuthor("osu", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Osu%21Logo_%282015%29.svg/220px-Osu%21Logo_%282015%29.svg.png")
    .setTitle(`**Osu Profile** ${client.getEmoji("kannaSip")}`)
    .setURL(`https://osu.ppy.sh/users/${player.user_id}`)
    .setDescription(
    `${client.getEmoji("star")}_Player:_ **${player.username}**\n` +
    `${client.getEmoji("star")}_Join Date:_ **${client.formatDate(player.join_date)}**\n` +
    `${client.getEmoji("star")}_Play Time:_ **${hours}h ${minutes}m ${seconds}s**\n` +
    `${client.getEmoji("star")}_Play count:_ **${player.playcount}**\n` +
    `${client.getEmoji("star")}${client.getEmoji("SSHrank")} **${player.count_rank_ssh}** ${client.getEmoji("SSrank")}` + 
    `**${player.count_rank_ss}** ${client.getEmoji("SHrank")} **${player.count_rank_sh}** ${client.getEmoji("Srank")} **${player.count_rank_s}**` + 
    `${client.getEmoji("Arank")} **${player.count_rank_a}**\n` +
    `${client.getEmoji("star")}${client.getEmoji("300hit")} **${player.count300}** ${client.getEmoji("100hit")} **${player.count100}**` + 
    `${client.getEmoji("50hit")} **${player.count50}**\n` +
    `${client.getEmoji("star")}_PP:_ **${player.pp_raw}**\n` +
    `${client.getEmoji("star")}_Score:_ **${player.ranked_score} (${player.total_score})**\n` +
    `${client.getEmoji("star")}_Rank:_ **#${player.pp_rank} (:flag_${player.country.toLowerCase()}: #${player.pp_country_rank})**\n` +
    `${client.getEmoji("star")}_Level:_ **${player.level.slice(0, 5)}**\n` +
    `${client.getEmoji("star")}_Accuracy:_ **${player.accuracy.slice(0, 5) + "%"}**\n` 
    )
    .setThumbnail(`https://a.ppy.sh/${player.user_id}`)
    message.channel.send(osuEmbed);
    


    
}
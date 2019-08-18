exports.run = async (discord: any, message: any, args: string[]) => {
    let lewdme = require("../../../assets/links/lewdme.json");
    let lewdmeEmbed = discord.createEmbed();
    
    console.log(lewdme)
    let random = Math.floor(Math.random() * (lewdme.pics.length - 1));
    lewdmeEmbed
    .setTitle(`**Lewd Me** ${discord.getEmoji("kisaragibawls")}`)
    .setURL(lewdme.pics[random].source)
    .setImage(lewdme.pics[random].link)
    message.channel.send(lewdmeEmbed);
}
exports.run = async (discord: any, message: any, args: string[]) => {
    const math = require("mathjs");

    let input = discord.combineArgs(args, 1);
    let result = math.eval(input);
    let calcEmbed = discord.createEmbed();
    calcEmbed
    .setTitle(`**Math Calculation** ${discord.getEmoji("vigneDead")}`)
    .setDescription(result)
    message.channel.send(calcEmbed);
    
}
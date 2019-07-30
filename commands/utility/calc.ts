
exports.run = async (client: any, message: any, args: string[]) => {
    const math = require("mathjs");

    let input = client.combineArgs(args, 1);
    let result = math.eval(input);
    let calcEmbed = client.createEmbed();
    calcEmbed
    .setTitle(`**Math Calculation** ${client.getEmoji("vigneDead")}`)
    .setDescription(result)
    message.channel.send(calcEmbed);
    
}
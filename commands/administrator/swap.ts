exports.run = async (discord: any, message: any, args: string[]) => {

    let pfp = await discord.fetchColumn("detection", "pfp");
    let weeb = await discord.fetchColumn("detection", "weeb");
    let normie = await discord.fetchColumn("detection", "normie");
    if (pfp.join("") === "off") return;
    let weebCounter = 0;
    let normieCounter = 0;

    for (let i = 0; i < message.guild.members.size; i++) {
        let memberArray = message.guild.members.map((m: any) => m);
        let result = await discord.swapRoles(message, memberArray[i], true);
        if (result === true) {
            weebCounter += 1;
        } else if (result === false) {
            normieCounter += 1;
        }
    }

    let swapEmbed = discord.createEmbed();
    swapEmbed
    .setTitle(`**Role Swapping** ${discord.getEmoji("gabYes")}`)
    .setDescription(
        `${discord.getEmoji("star")}**${weebCounter}** members were swapped into the <@&${weeb.join("")}> role.\n` +
        `${discord.getEmoji("star")}**${normieCounter}** members were swapped into the <@&${normie.join("")}> role.\n` 
    )
    message.channel.send(swapEmbed);
}
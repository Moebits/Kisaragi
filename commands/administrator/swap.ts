exports.run = async (client: any, message: any, args: string[]) => {

    let pfp = await client.fetchColumn("detection", "pfp");
    let weeb = await client.fetchColumn("detection", "weeb");
    let normie = await client.fetchColumn("detection", "normie");
    if (pfp.join("") === "off") return;
    let weebCounter = 0;
    let normieCounter = 0;

    for (let i = 0; i < message.guild.members.size; i++) {
        let memberArray = message.guild.members.map((m: any) => m);
        let result = await client.swapRoles(message, memberArray[i], true);
        if (result === true) {
            weebCounter += 1;
        } else if (result === false) {
            normieCounter += 1;
        }
    }

    let swapEmbed = client.createEmbed();
    swapEmbed
    .setTitle(`**Role Swapping** ${client.getEmoji("gabYes")}`)
    .setDescription(
        `${client.getEmoji("star")}**${weebCounter}** members were swapped into the <@&${weeb.join("")}> role.\n` +
        `${client.getEmoji("star")}**${normieCounter}** members were swapped into the <@&${normie.join("")}> role.\n` 
    )
    message.channel.send(swapEmbed);
}
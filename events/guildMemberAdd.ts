module.exports = async (client: any, member: any) => {

    await require("../exports/images.js")(client, member.lastMessage);
    
    let welcomeToggle = await client.fetchColumn("welcome leaves", "welcome toggle");
    if (welcomeToggle.join("") === "off") return;

    let welcomeMsg = await client.fetchColumn("welcome leaves", "welcome message");
    let welcomeChannel = await client.fetchColumn("welcome leaves", "welcome channel");
    let welcomeImage = await client.fetchColumn("welcome leaves", "welcome bg image");
    let welcomeText = await client.fetchColumn("welcome leaves", "welcome bg text");
    let welcomeColor = await client.fetchColumn("welcome leaves", "welcome bg color");
    const channel = member.guild.channels.find(c => c.id.toString() === welcomeChannel.join(""));

    let attachment = await client.createCanvas(member, welcomeImage, welcomeText, welcomeColor);

    let newMsg = welcomeMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
    .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount)

    channel.send(newMsg, attachment);

}
module.exports = async (client: any, member: any) => {

    await require("../exports/images.js")(client, member.lastMessage);
    
    let leaveToggle = await client.fetchColumn("welcome leaves", "leave toggle");
    if (leaveToggle.join("") === "off") return;

    let leaveMsg = await client.fetchColumn("welcome leaves", "leave message");
    let leaveChannel = await client.fetchColumn("welcome leaves", "leave channel");
    let leaveImage = await client.fetchColumn("welcome leaves", "leave bg image");
    let leaveText = await client.fetchColumn("welcome leaves", "leave bg text");
    let leaveColor = await client.fetchColumn("welcome leaves", "leave bg color");
    const channel = member.guild.channels.find(c => c.id.toString() === leaveChannel.join(""));

    let attachment = await client.createCanvas(member, leaveImage, leaveText, leaveColor);

    let newMsg = leaveMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
    .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount)

    channel.send(newMsg, attachment);
    
}
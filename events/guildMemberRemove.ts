module.exports = async (client: any, member: any) => {

    let bans = await member.guild.fetchBans();
    if (bans.has(member.id)) return;

    await require("../exports/images.js")(client, member.lastMessage);

    async function leaveMessages() {
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

    leaveMessages();

    async function leaveBan() {
        let leaveToggle = await client.fetchColumn("blocks", "leaver ban toggle");
        const banEmbed: any = client.createEmbed();
        if (leaveToggle.join("") === "off") return;

        let now = Math.ceil(Date.now());
        let joinDate = member.joinedTimestamp;
        if ((now - joinDate) <= 300000) {
            let channel = member.lastMessage ? member.lastMessage.channel : (member.guild.systemChannel || member.guild.defaultChannel);
            let reason = "Joining and leaving in under 5 minutes."
            await member.guild.ban(member, reason);
            banEmbed
            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
            .setTitle(`**Member Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`);
            channel.send(banEmbed);
            banEmbed
            .setTitle(`**You Were Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`);
            await member.user.send(banEmbed);
        }
    }

    leaveBan();
}
module.exports = async (client: any, member: any) => {

    let bans = await member.guild.fetchBans();
    if (bans.has(member.id)) return;

    let defaultChannel;
    let defChannel = await client.fetchColumn("blocks", "default channel");
    if (defChannel.join("")) {
        let allChannels = await client.channels;
        defaultChannel = allChannels.find((c) => c.id.toString() === defChannel.join(""));
    }

    let defMessage;
    if (defaultChannel) {
        defMessage = await defaultChannel.fetchMessages({limit: 1});
    }

    await require("../exports/images.js")(client, defMessage ? defMessage.first() : null);

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
            let channel = defaultChannel;
            let reason = "Joining and leaving in under 5 minutes."
            banEmbed
            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
            .setTitle(`**Member Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`);
            if (channel) channel.send(banEmbed);
            banEmbed
            .setTitle(`**You Were Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`);
            await member.ban(reason);
        }
    }

    leaveBan();
}
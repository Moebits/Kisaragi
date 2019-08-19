module.exports = async (discord: any, member: any) => {

    let bans = await member.guild.fetchBans();
    if (bans.has(member.id)) return;

    let defaultChannel;
    let defChannel = await discord.fetchColumn("blocks", "default channel");
    if (defChannel.join("")) {
        let allChannels = await discord.channels;
        defaultChannel = allChannels.find((c) => c.id.toString() === defChannel.join(""));
    }

    let defMessage;
    if (defaultChannel) {
        defMessage = await defaultChannel.fetchMessages({limit: 1});
    }

    await require("../exports/images.js")(discord, defMessage ? defMessage.first() : null);

    async function leaveMessages() {
        let leaveToggle = await discord.fetchColumn("welcome leaves", "leave toggle");
        if (leaveToggle.join("") === "off") return;

        let leaveMsg = await discord.fetchColumn("welcome leaves", "leave message");
        let leaveChannel = await discord.fetchColumn("welcome leaves", "leave channel");
        let leaveImage = await discord.fetchColumn("welcome leaves", "leave bg image");
        let leaveText = await discord.fetchColumn("welcome leaves", "leave bg text");
        let leaveColor = await discord.fetchColumn("welcome leaves", "leave bg color");
        const channel = member.guild.channels.find(c => c.id.toString() === leaveChannel.join(""));

        let attachment = await discord.createCanvas(member, leaveImage, leaveText, leaveColor);

        let newMsg = leaveMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount)

        channel.send(newMsg, attachment);
    }

    leaveMessages();

    let pfpCheckArray = await discord.fetchColumn("ignore", "pfp");
    let pfpCheck = false;
    for (let i = 0; i < pfpCheckArray.length; i++) {
        if (member.id === pfpCheckArray[i]) {
            pfpCheck = true;
        }
    }

    async function leaveBan() {
        if (pfpCheck) return;
        let leaveToggle = await discord.fetchColumn("blocks", "leaver ban toggle");
        const banEmbed: any = discord.createEmbed();
        if (leaveToggle.join("") === "off") return;

        let now = Math.ceil(Date.now());
        let joinDate = member.joinedTimestamp;
        if ((now - joinDate) <= 300000) {
            let channel = defaultChannel;
            let reason = "Joining and leaving in under 5 minutes."
            banEmbed
            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
            .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`);
            if (channel) channel.send(banEmbed);
            banEmbed
            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`);
            await member.ban(reason);
        }
    }

    leaveBan();
}
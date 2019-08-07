module.exports = async (client: any, member: any) => {

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

    async function welcomeMessages() {
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

    welcomeMessages();

    async function avatarBan() {
        let banToggle = await client.fetchColumn("blocks", "leaver ban toggle");
        const banEmbed: any = client.createEmbed();
        if (banToggle.join("") === "off") return;

        if (!member.user.avatarURL) {
            let channel = defaultChannel;
            let reason = "Has the default discord avatar."
            await member.guild.ban(member, reason);
            banEmbed
            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
            .setTitle(`**Member Banned** ${client.getEmoji("kannaFU")}`)
            .setDescription(`${client.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`);
            if (channel) channel.send(banEmbed);
        }
        
    }

    avatarBan();

}
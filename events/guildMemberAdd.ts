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
    await require("../exports/detection.js")(discord, defMessage ? defMessage.first() : null);

    let pfpCheckArray = await discord.fetchColumn("ignore", "pfp");
    for (let i = 0; i < pfpCheckArray.length; i++) {
        if (member.id === pfpCheckArray[i]) {
            await discord.deleteRow("ignore", "pfp", member.id);
        }
    }

    async function animePfp() {
        let result = await discord.swapRoles(defMessage ? defMessage.first() : null, member, true);
        if (result === false) {
            await discord.insertInto("ignore", "pfp", member.id);
            let channel = defaultChannel;
            let reason = "Doesn't have an anime profile picture!";
            let dm = await member.user.createDM();
            let kickEmbed = discord.createEmbed();
            kickEmbed
            .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
            .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were kicked from ${member.guild.name} for reason:_ **${reason}**`);
            await dm.send(kickEmbed);
            if (channel) await channel.send(kickEmbed);
            await member.kick(reason);
        }
    }

    animePfp();

    async function welcomeMessages() {
        let welcomeToggle = await discord.fetchColumn("welcome leaves", "welcome toggle");
        if (welcomeToggle.join("") === "off") return;

        let welcomeMsg = await discord.fetchColumn("welcome leaves", "welcome message");
        let welcomeChannel = await discord.fetchColumn("welcome leaves", "welcome channel");
        let welcomeImage = await discord.fetchColumn("welcome leaves", "welcome bg image");
        let welcomeText = await discord.fetchColumn("welcome leaves", "welcome bg text");
        let welcomeColor = await discord.fetchColumn("welcome leaves", "welcome bg color");
        const channel = member.guild.channels.find(c => c.id.toString() === welcomeChannel.join(""));

        let attachment = await discord.createCanvas(member, welcomeImage, welcomeText, welcomeColor);

        let newMsg = welcomeMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount)

        channel.send(newMsg, attachment);
    }

    welcomeMessages();

    async function avatarBan() {
        let banToggle = await discord.fetchColumn("blocks", "leaver ban toggle");
        const banEmbed: any = discord.createEmbed();
        if (banToggle.join("") === "off") return;

        if (!member.user.avatarURL) {
            let channel = defaultChannel;
            let reason = "Has the default discord avatar."
            banEmbed
            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
            .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`);
            if (channel) channel.send(banEmbed);
            banEmbed
            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
            .setDescription(`${discord.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`);
            let dm = await member.user.createDM();
            try { 
                await dm.send(banEmbed);
            } catch (err) {
                console.log(err)
            }
            await member.ban(reason);
        }
        
    }

    avatarBan();

}
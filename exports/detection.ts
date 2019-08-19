module.exports = async (discord: any, message: any) => {

    const cv = require('opencv4nodejs');
    const download = require('image-downloader')
    const classifier = new cv.CascadeClassifier("../assets/cascades/animeface.xml");
    let anime = await discord.fetchColumn("detection", "anime");
    let pfp = await discord.fetchColumn("detection", "pfp");
    let gifFrames = require('gif-frames');
    let fs = require('fs');

    discord.detectAnime = async (msg: any) => {
        if (!anime) return;
        if (anime.join("") === "off") return;
        if (msg.author.id === discord.user.id) return;
        if (msg.attachments.size) {
            let urls = msg.attachments.map((a) => a.url);
            for (let i = 0; i < urls.length; i++) {
                await download.image({url: urls[i], dest: `../assets/detection/image${i}.jpg`});
                const img = await cv.imreadAsync(`../assets/detection/image${i}.jpg`);
                const result = await classifier.detectMultiScaleAsync(img);
                if (!result.objects.join("")) {
                    let reply = await msg.reply("You can only post anime pictures!");
                    await msg.delete();
                    reply.delete(10000);
                }
            }
        }
    }

    discord.swapRoles = async (msg: any, member?: any, counter?: boolean) => {
        if (!pfp) return;
        if (pfp.join("") === "off") return;
        if (msg.author.id === discord.user.id) return;
        if (!member) member = msg.member;
        if (!member.user.displayAvatarURL) return;
        let weeb = await discord.fetchColumn("detection", "weeb");
        let normie = await discord.fetchColumn("detection", "normie");
        let weebRole = msg.guild.roles.find((r: any) => r.id === weeb.join(""));
        let normieRole = msg.guild.roles.find((r: any) => r.id === normie.join(""));
        if (member.user.displayAvatarURL.slice(-3) === "gif") {
            gifFrames({url: member.user.displayAvatarURL, frames: 1}).then((frameData) => {
                frameData[0].getImage().pipe(fs.createWriteStream('../assets/detection/user.jpg'));
            });
            await discord.timeout(1000);
        } else {
            await download.image({url: member.user.displayAvatarURL, dest: `../assets/detection/user.jpg`});
        } 
        const img = await cv.imreadAsync(`../assets/detection/user.jpg`);
        const result = await classifier.detectMultiScaleAsync(img);
                if (!result.objects.join("")) {
                    let reply = await msg.reply("You can only post anime pictures!");
                    await msg.delete();
                    reply.delete(10000);
                }
        if (!result.objects.join("")) {
            let found = member.roles.find((r: any) => r === normieRole);
            if (found) {
                return;
            } else {
                if (member.roles.find((r: any) => r.id === weebRole.id)) {
                    await member.removeRole(weebRole);
                }
                await member.addRole(normieRole);
                if (counter) {
                    return false;
                } else {
                    return msg.reply(`You were swapped to the <@&${normie.join("")}> role because you do not have an anime profile picture!`);
                }
            }
        } else {
            let found = member.roles.find((r: any) => r.id === weebRole.id);
            if (found) {
                return;
            } else {
                if (member.roles.find((r: any) => r.id === normieRole.id)) {
                    await member.removeRole(normieRole);
                }
                await member.addRole(weebRole);
                if (counter) {
                    return true;
                } else {
                    return msg.reply(`You were swapped to the <@&${weeb.join("")}> role because you have an anime profile picture!`);
                }
            }
        }
    }
}
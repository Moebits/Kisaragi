import Discord from "discord.js";
import GifCanvas from "gif-canvas";

module.exports = async (client: any, member: any) => {
    const Canvas = require('canvas');
    let welcomeToggle = await client.fetchColumn("welcome leaves", "welcome toggle");
    if (welcomeToggle.join("") === "off") return;
    
    let welcomeMsg = await client.fetchColumn("welcome leaves", "welcome message");
    let welcomeChannel = await client.fetchColumn("welcome leaves", "welcome channel");
    let welcomeImage = await client.fetchColumn("welcome leaves", "welcome bg image");
    let welcomeText = await client.fetchColumn("welcome leaves", "welcome bg text");
    let welcomeColor = await client.fetchColumn("welcome leaves", "welcome bg color");
    const channel = member.guild.channels.find(c => c.id.toString() === welcomeChannel.join(""));

    let newMsg = welcomeMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
    .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount)

    let newText = welcomeText.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
    .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount)

    const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
        let fontSize = 70;
        do {
            ctx.font = `${fontSize -= 10}07NikumaruFont`;
        } while (ctx.measureText(text).width > canvas.width - 300);
    
        return ctx.font;
    };
    
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    let background: any;
    if (welcomeImage.join("").slice(-3) === "gif") {
        let gc = GifCanvas(welcomeImage.join(""), {
            fps: 30
          });
        background = gc.canvas;
    } else {
        background = await Canvas.loadImage(welcomeImage.join(""));
    }

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#74037b';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px 07NikumaruFont';
    ctx.fillStyle = welcomeColor.join("");
    ctx.fillText(newText, canvas.width / 2.5, canvas.height / 3.5);

    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = welcomeColor.join("");
    ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(newMsg, attachment);

}
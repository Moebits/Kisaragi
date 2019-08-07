exports.run = async (client: any, message: any, args: string[]) => {
    let vToggle = await client.fetchColumn("captcha", "verify toggle");
    if (vToggle.join("") === "off") return;
    let vRole = await client.fetchColumn("captcha", "verify role");
    let cType = await client.fetchColumn("captcha", "captcha type");

    let role = message.guild.roles.find((r: any) => r.id === vRole.join(""));
    if (!role) {
        let vErrorEmbed = client.createEmbed();
        vErrorEmbed.setDescription("Could not find the verify role!")
        return vErrorEmbed;
    }
    let type = cType.join("");

    let svgCaptcha = require('svg-captcha');
    const {convert} = require('convert-svg-to-png');
    const {Attachment} = require("discord.js");

    async function createCaptcha() {
        let captcha;
        if (type === "text") {
            captcha = svgCaptcha.create({
                size: 4,
                ignoreChars: "0oli",
                noise: 1,
                color: true,
                background: "#ffffff"
            });
            
        } else {
            captcha = svgCaptcha.createMathExpr({
                mathMin: 1,
                mathMax: 100,
                mathOperator: "+-"
            });
        }
        let img = await convert(captcha.data);

        let attachment = new Attachment(img, "captcha.png");

        let captchaEmbed = client.createEmbed();
        captchaEmbed
        .setTitle(`Captcha ${client.getEmoji("kannaAngry")}`)
        .attachFiles([attachment.file])
        .setImage(`attachment://captcha.png`)
        .setDescription(
            `${client.getEmoji("star")}_Solve the captcha below. Type **cancel** to quit, or **skip** to get another captcha._`
        )
        return {
            captcha: captchaEmbed,
            text: captcha.text
        }
    }

    let {captcha, text} = await createCaptcha();

    const filter = response => {
        return (response.author === message.author);
    };
    
    function sendCaptcha(captcha, text) {
        message.channel.send(captcha).then(() => {
            message.channel.awaitMessages(filter, {maxMatches: 1, time: 100000, errors: ['time']})
                .then(async collected => {
                    let msg = collected.first();
                    let responseEmbed = client.createEmbed();
                    responseEmbed
                    .setTitle(`Captcha ${client.getEmoji("kannaAngry")}`)
                    if (msg.content.trim() === "cancel") {
                        responseEmbed
                        .setDescription("Quit the captcha prompts.")
                        return msg.channel.send(responseEmbed);
                    } else if (msg.content.trim() === "skip") {
                        message.reply("Skipped this captcha!")
                        let {captcha, text} = await createCaptcha();
                        return sendCaptcha(captcha, text);
                    } else if (msg.content.trim() === text) {
                        if (msg.member.roles.has(role)) {
                            await msg.member.removeRole(role);
                            await msg.member.addRole(role, "Successfully solved the captcha");
                        } else {  
                            await msg.member.addRole(role, "Successfully solved the captcha");
                        }
                        responseEmbed
                        .setDescription(`${client.getEmoji("pinkCheck")} **${msg.member.displayName}** was verified!`)
                        return msg.channel.send(responseEmbed);
                    } else {
                        msg.reply("Wrong answer! Please try again.")
                        let {captcha, text} = await createCaptcha();
                        return sendCaptcha(captcha, text);
                    }
                })
                .catch(collected => {
                    console.log(collected)
                    message.channel.send('Quit the captcha because the time has run out.');
                });
        });
        
    }
    
    sendCaptcha(captcha, text);
}
exports.run = async (discord: any, message: any, args: string[]) => {
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        captchaPrompt(message);
        return;
    }
    let vToggle = await discord.fetchColumn("captcha", "verify toggle");
    let vRole = await discord.fetchColumn("captcha", "verify role");
    let cType = await discord.fetchColumn("captcha", "captcha type");
    let color = await discord.fetchColumn("captcha", "captcha color");
    let difficulty = await discord.fetchColumn("captcha", "difficulty");
    let captchaEmbed = discord.createEmbed();
    let {captcha} = await discord.createCaptcha(cType, color, difficulty);
    console.log(captcha.files)
    captchaEmbed
    .setTitle(`**Captcha Verification** ${discord.getEmoji("kannaAngry")}`)
    .attachFiles(captcha.files)
    .setImage(captcha.image.url)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for captcha verification. In order for this to function, you should create a role for verified members " +
        "and deny the @everyone role reading permissions in all your guild channels, with the exception of the rules channel and the verify channel. Use **verify** to send a captcha.\n" +
        "\n" +
        "**Verify Role** = The role given to members who solve the captcha.\n" +
        "**Captcha Type** = Either text or math.\n" +
        "**Captcha Difficulty** = Either easy, medium, hard, or extreme.\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${discord.getEmoji("star")}_Verify Role:_ **${vRole.join("") ? "<@&" + vRole.join("") + ">" : "None"}**\n` +
        `${discord.getEmoji("star")}_Verify Toggle:_ **${vToggle.join("")}**\n` +
        `${discord.getEmoji("star")}_Captcha Type:_ **${cType.join("")}**\n` +
        `${discord.getEmoji("star")}_Captcha Difficulty:_ **${difficulty.join("")}**\n` +
        `${discord.getEmoji("star")}_Background Color:_ **${color.join("")}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${discord.getEmoji("star")}_Type **enable** or **disable** to enable or disable verification._\n` +
        `${discord.getEmoji("star")}_**Mention a role** or type the **role id** to set the verified role._\n` +
        `${discord.getEmoji("star")}_Type **text** or **math** to set the captcha type._\n` +
        `${discord.getEmoji("star")}_Type **easy**, **medium**, **hard**, or **extreme** to set the difficulty._\n` +
        `${discord.getEmoji("star")}_Type a **hex color** to set the background color._\n` +
        `${discord.getEmoji("star")}_**You can type multiple options** to enable all at once._\n` +
        `${discord.getEmoji("star")}_Type **reset** to reset all settings._\n` +
        `${discord.getEmoji("star")}_Type **cancel** to exit._\n`
    )
    message.channel.send(captchaEmbed)

    async function captchaPrompt(msg: any) {
        let responseEmbed = discord.createEmbed();
        responseEmbed.setTitle(`**Captcha Verification** ${discord.getEmoji("kannaAngry")}`);
        let setOn, setOff, setRole, setText, setMath, setColor, setEasy, setMedium, setHard, setExtreme;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("captcha", "verify toggle", "off");
            await discord.updateColumn("captcha", "verify role", null);
            await discord.updateColumn("captcha", "captcha type", "text");
            await discord.updateColumn("captcha", "captcha color", "#ffffff");
            await discord.updateColumn("captcha", "difficulty", "medium");
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}All settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }

        let newRole = msg.content.match(/\d+/g);
        let newColor = msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig);

        if (msg.content.match(/enable/gi)) setOn = true;
        if (msg.content.match(/disable/gi)) setOff = true;
        if (msg.content.match(/text/gi)) setText = true;
        if (msg.content.match(/math/gi)) setMath = true;
        if (msg.content.match(/easy/gi)) setEasy = true;
        if (msg.content.match(/medium/gi)) setMedium = true;
        if (msg.content.match(/hard/gi)) setHard = true;
        if (msg.content.match(/extreme/gi)) setExtreme = true;
        if (newRole) setRole = true;
        if (newColor) setColor = true;

        if (setOn && setOff) {
            responseEmbed
                .setDescription(`${discord.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setText && setMath) {
            responseEmbed
                .setDescription(`${discord.getEmoji("star")}You cannot set both captcha types at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setOn && !setRole) {
            responseEmbed
                .setDescription(`${discord.getEmoji("star")}In order to enable verification, you must set the verify role.`)
                msg.channel.send(responseEmbed);
                return;
        }

        
        let description = "";

        if (setExtreme || setHard || setMedium || setEasy) {
            let diff = setExtreme ? setExtreme : (
                setHard ? setHard : (
                setMedium ? setMedium : setEasy));
            await discord.updateColumn("captcha", "verify toggle", diff.join(""));
            description += `${discord.getEmoji("star")}Captcha difficulty set to **${diff.join("")}**!\n`;
        }

        if (setOn) {
            await discord.updateColumn("captcha", "verify toggle", "on");
            description += `${discord.getEmoji("star")}Captcha verification is **on**!\n`;
        }
        if (setOff) {
            await discord.updateColumn("captcha", "verify toggle", "off");
            description += `${discord.getEmoji("star")}Captcha verification is **off**!\n`;
        }
        if (setText) {
            await discord.updateColumn("captcha", "captcha type", "text");
            description += `${discord.getEmoji("star")}Captcha type set to **text**!\n`;
        }
        if (setMath) {
            await discord.updateColumn("captcha", "captcha type", "math");
            description += `${discord.getEmoji("star")}Captcha type set to **math**!\n`;
        }
        if (setRole) {
            await discord.updateColumn("captcha", "verify role", newRole.join(""));
            description += `${discord.getEmoji("star")}Verify role set to <@&${newRole}>!\n`;
        }
        if (setColor) {
            await discord.updateColumn("captcha", "captcha color", newColor.join(""));
            description += `${discord.getEmoji("star")}Background color set to ${newColor.join("")}\n`;
        }
        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    discord.createPrompt(captchaPrompt)
}
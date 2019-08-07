exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        captchaPrompt(message);
        return;
    }
    let vToggle = await client.fetchColumn("captcha", "verify toggle");
    let vRole = await client.fetchColumn("captcha", "verify role");
    let cType = await client.fetchColumn("captcha", "captcha type");
    let captchaEmbed = client.createEmbed();
    captchaEmbed
    .setTitle(`**Captcha Verification** ${client.getEmoji("kannaAngry")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for captcha verification. In order for this to function, you should create a role for verified members " +
        "and deny the @everyone role reading permissions in all your guild channels, with the exception of the rules channel and the verify channel.\n" +
        "\n" +
        "**Verify Toggle** = Whether verification is enabled or disabled.\n" +
        "**Verify Role** = The role given to members who solve the captcha.\n" +
        "**Captcha Type** = Either text or math.\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${client.getEmoji("star")}_Verify Role:_ **${vRole.join("") ? "<@&" + vRole.join("") + ">" : "None"}**\n` +
        `${client.getEmoji("star")}_Verify Toggle:_ **${vToggle.join("")}**\n` +
        `${client.getEmoji("star")}_Captcha Type:_ **${cType.join("")}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_Type **enable** or **disable** to enable or disable verification._\n` +
        `${client.getEmoji("star")}_**Mention a role** or type the **role id** to set the verified role._\n` +
        `${client.getEmoji("star")}_Type **text** or **math** to set the captcha type._\n` +
        `${client.getEmoji("star")}_**You can type multiple options** to enable all at once._\n` +
        `${client.getEmoji("star")}_Type **reset** to reset all settings._\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit._\n`
    )
    message.channel.send(captchaEmbed)

    async function captchaPrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        responseEmbed.setTitle(`**Captcha Verification** ${client.getEmoji("kannaAngry")}`);
        let setOn, setOff, setRole, setText, setMath;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("captcha", "verify toggle", "off");
            await client.updateColumn("captcha", "verify role", null);
            await client.updateColumn("captcha", "captcha type", "text");
            responseEmbed
            .setDescription(`${client.getEmoji("star")}All settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }

        let newRole = msg.content.match(/\d+/g);

        if (msg.content.match(/enable/g)) setOn = true;
        if (msg.content.match(/disable/g)) setOff = true;
        if (msg.content.match(/text/g)) setText = true;
        if (msg.content.match(/math/g)) setMath = true;
        if (newRole) setRole = true;

        if (setOn && setOff) {
            responseEmbed
                .setDescription(`${client.getEmoji("star")}You cannot disable/enable at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setText && setMath) {
            responseEmbed
                .setDescription(`${client.getEmoji("star")}You cannot set both captcha types at the same time.`)
                msg.channel.send(responseEmbed);
                return;
        }

        if (setOn && !setRole) {
            responseEmbed
                .setDescription(`${client.getEmoji("star")}In order to enable verification, you must set the verify role.`)
                msg.channel.send(responseEmbed);
                return;
        }

        let description = "";

        if (setOn) {
            await client.updateColumn("captcha", "verify toggle", "on");
            description += `${client.getEmoji("star")}Captcha verification is **on**!\n`;
        }
        if (setOff) {
            await client.updateColumn("captcha", "verify toggle", "off");
            description += `${client.getEmoji("star")}Captcha verification is **off**!\n`;
        }
        if (setText) {
            await client.updateColumn("captcha", "captcha type", "text");
            description += `${client.getEmoji("star")}Captcha type set to **text**!\n`;
        }
        if (setMath) {
            await client.updateColumn("captcha", "captcha type", "math");
            description += `${client.getEmoji("star")}Captcha type set to **math**!\n`;
        }
        if (setRole) {
            await client.updateColumn("captcha", "verify role", newRole.join(""));
            description += `${client.getEmoji("star")}Verify role set to <@&${newRole}>!\n`;
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    client.createPrompt(captchaPrompt)
}
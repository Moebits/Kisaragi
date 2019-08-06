exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        instantBanPrompt(message);
        return;
    }
    
    let pfpBan = await client.fetchColumn("blocks", "pfp ban toggle");
    let leaveBan = await client.fetchColumn("blocks", "leaver ban toggle");
    let defChannel = await client.fetchColumn("blocks", "default channel");
    let instantBanEmbed = client.createEmbed();
    instantBanEmbed
    .setTitle(`**Instant Bans** ${client.getEmoji("mexShrug")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for instant bans.\n" +
        "\n" +
        "**Profile Picture Ban** = Bans all members that have a default profile picture upon joining.\n" +
        "**Leave Ban** = Bans all members that join and then leave in under 5 minutes.\n" +
        "**Default Channel** = The default channel where messages will be posted.\n" +
        "\n" +
        "__Current Settings:__\n" +
        `${client.getEmoji("star")}_Profile Picture Ban:_ **${pfpBan.join("")}**\n` +
        `${client.getEmoji("star")}_Leave Ban:_ **${leaveBan.join("")}**\n` +
        `${client.getEmoji("star")}_Default Channel:_ **${defChannel.join("") ? `<#${defChannel.join("")}>` : "None"}**\n` +
        "\n" +
        "__Edit Settings:__\n" +
        `${client.getEmoji("star")}_Type **pfp** to toggle profile picture bans._\n` +
        `${client.getEmoji("star")}_Type **leave** to toggle leave bans._\n` +
        `${client.getEmoji("star")}_**Mention a channel** to set the default channel._\n` +
        `${client.getEmoji("star")}_**You can type multiple options** to enable all at once._\n` +
        `${client.getEmoji("star")}_Type **reset** to disable all settings._\n` +
        `${client.getEmoji("star")}_Type **cancel** to exit._\n`
    )
    message.channel.send(instantBanEmbed)

    async function instantBanPrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        let setPfp, setLeave, setChannel;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("blocks", "pfp ban toggle", "off");
            await client.updateColumn("blocks", "leaver ban toggle", "off");
            responseEmbed
            .setDescription(`${client.getEmoji("star")}All settings were disabled!`)
            msg.channel.send(responseEmbed);
            return;
        }
        if (msg.content.match(/pfp/g)) setPfp = true;
        if (msg.content.match(/leave/g)) setLeave = true;
        if (msg.mentions.channels.array().join("")) setChannel = true;

        if (setChannel) {
            let channel = msg.guild.channels.find((c: any) => c === msg.mentions.channels.first());
            await client.updateColumn("blocks", "default channel", channel.id);
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Default channel set to <#${channel.id}>!\n`);
            if (setPfp || setLeave) {
                msg.channel.send(responseEmbed);
            } else {
                msg.channel.send(responseEmbed);
                return;
            }
        }

        if (setPfp && setLeave) {
            await client.updateColumn("blocks", "pfp ban toggle", "on");
            await client.updateColumn("blocks", "leaver ban toggle", "on");
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Profile picture and leave bans are now **on**!`)
            msg.channel.send(responseEmbed);
            return;
        }

        if (setPfp) {
            if (pfpBan.join("") === "off") {
                await client.updateColumn("blocks", "pfp ban toggle", "on");
                responseEmbed
                .setDescription(`${client.getEmoji("star")}Profile picture bans are now **on**!`)
                msg.channel.send(responseEmbed);
                return;
            } else {
                await client.updateColumn("blocks", "pfp ban toggle", "off");
                responseEmbed
                .setDescription(`${client.getEmoji("star")}Profile picture bans are now **off**!`)
                msg.channel.send(responseEmbed);
                return;
            }
        }

        if (setLeave) {
            if (pfpBan.join("") === "off") {
                await client.updateColumn("blocks", "leaver ban toggle", "on");
                responseEmbed
                .setDescription(`${client.getEmoji("star")}Leave bans are now **on**!`)
                msg.channel.send(responseEmbed);
                return;
            } else {
                await client.updateColumn("blocks", "leaver ban toggle", "off");
                responseEmbed
                .setDescription(`${client.getEmoji("star")}Leave bans are now **off**!`)
                msg.channel.send(responseEmbed);
                return;
            }
        }
    }

    client.createPrompt(instantBanPrompt);
}
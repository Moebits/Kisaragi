exports.run = async (client: any, message: any, args: string[]) => {
    let input = client.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        detectPrompt(message);
        return;
    }

    let links = await client.fetchColumn("detection", "links");
    let anime = await client.fetchColumn("detection", "anime");
    let pfp = await client.fetchColumn("detection", "pfp");
    let weeb = await client.fetchColumn("detection", "weeb");
    let normie = await client.fetchColumn("detection", "normie");
    let detectEmbed = client.createEmbed();
    detectEmbed
    .setTitle(`**Detection Settings** ${client.getEmoji("sagiriBleh")}`)
    .setThumbnail(message.guild.iconURL)
    .setDescription(
        "Configure settings for automatic detection.\n" +
        "\n" +
        "**Link Detection** = Detects links and automatically runs the corresponding command.\n" +
        "**Anime Detection** = Removes all pictures that don't contain anime characters.\n" +
        "**Pfp Detection** = Actively swaps members between the weeb role (anime pfp) and normie role (non anime pfp).\n" +
        "\n" +
        "__Current Settings__\n" +
        `${client.getEmoji("star")}Link detection is **${links.join("")}**\n` + 
        `${client.getEmoji("star")}Anime detection is **${anime.join("")}**\n` + 
        `${client.getEmoji("star")}Pfp detection is **${pfp.join("")}**\n` + 
        `${client.getEmoji("star")}Weeb role set to: ${weeb.join("") ? `<@&${weeb.join("")}>` : "None"}\n` + 
        `${client.getEmoji("star")}Normie role set to: ${normie.join("") ? `<@&${normie.join("")}>` : "None"}\n` + 
        "\n" +
        "__Edit Settings__\n" +
        `${client.getEmoji("star")}Type **link** to toggle link detection on/off.\n` + 
        `${client.getEmoji("star")}Type **anime** to toggle anime detection on/off.\n` + 
        `${client.getEmoji("star")}Type **pfp** to toggle pfp detection on/off.\n` + 
        `${client.getEmoji("star")}**Mention a role or type a role id** to set the weeb role.\n` + 
        `${client.getEmoji("star")}Mention a role or type a role id **between brackets [role]** to set the normie role.\n` + 
        `${client.getEmoji("star")}You can set **multiple options at the same time**.\n` + 
        `${client.getEmoji("star")}Type **reset** to reset settings.\n` + 
        `${client.getEmoji("star")}Type **cancel** to exit.\n` 
    )
    message.channel.send(detectEmbed);

    async function detectPrompt(msg: any) {
        let responseEmbed = client.createEmbed();
        responseEmbed.setTitle(`**Detection Settings** ${client.getEmoji("sagiriBleh")}`);
        let links = await client.fetchColumn("detection", "links");
        let anime = await client.fetchColumn("detection", "anime");
        let pfp = await client.fetchColumn("detection", "pfp");
        let weeb = await client.fetchColumn("detection", "weeb");
        let normie = await client.fetchColumn("detection", "normie");
        let setLink, setAnime, setPfp, setWeeb, setNormie;

        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${client.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await client.updateColumn("detection", "links", "on");
            await client.updateColumn("detection", "anime", "off");
            await client.updateColumn("detection", "pfp", "off");
            await client.updateColumn("detection", "weeb", null);
            await client.updateColumn("detection", "normie", null);
            responseEmbed
            .setDescription(`${client.getEmoji("star")}All settings were reset!`)
            msg.channel.send(responseEmbed);
            return;
        }

        if (msg.content.match(/link/gi)) setLink = true;
        if (msg.content.match(/anime/gi)) setAnime = true;
        if (msg.content.match(/pfp/gi)) setPfp = true;
        let newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "").replace(/\s+/g, "");
        let weebRole = newMsg.replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g);
        let normieRole = newMsg.match(/(?<=\[)(.*?)(?=\])/g);
        if (weebRole) setWeeb = true;
        if (normieRole) setNormie = true;

        let description = "";

        if (setLink) {
            if (links.join("") === "off") {
                await client.updateColumn("detection", "links", "on");
                description += `${client.getEmoji("star")}Link detection is **on**!\n`
            } else {
                await client.updateColumn("detection", "links", "off");
                description += `${client.getEmoji("star")}Link detection is **off**!\n`
            }
        }

        if (setAnime) {
            if (anime.join("") === "off") {
                await client.updateColumn("detection", "anime", "on");
                description += `${client.getEmoji("star")}Anime detection is **on**!\n`
            } else {
                await client.updateColumn("detection", "anime", "off");
                description += `${client.getEmoji("star")}Anime detection is **off**!\n`
            }
        }

        if (setPfp) {
            if (pfp.join("") === "off") {
                if (!weeb.join("") || !normie.join("")) {
                    let testWeeb, testNormie;
                    if (!weeb.join("") && setWeeb) testWeeb = true;
                    if (!normie.join("") && setNormie) testNormie = true;
                    if (weeb.join("")) testWeeb = true;
                    if (normie.join("")) testNormie = true;
                    if (!(testWeeb && testNormie)) {
                        responseEmbed
                        .setDescription("In order to turn on pfp detection, you must set both the weeb and normie role.")
                        message.channel.send(responseEmbed)
                        return;
                    }
                }
                await client.updateColumn("detection", "pfp", "on");
                description += `${client.getEmoji("star")}Pfp detection is **on**!\n`
            } else {
                await client.updateColumn("detection", "pfp", "off");
                description += `${client.getEmoji("star")}Pfp detection is **off**!\n`
            }
        }

        if (setWeeb) {
            await client.updateColumn("detection", "weeb", weebRole.join(""));
            description += `${client.getEmoji("star")}Weeb role set to **<@&${weebRole.join("")}>**!\n`
        }

        if (setNormie) {
            await client.updateColumn("detection", "normie", normieRole.join(""));
            description += `${client.getEmoji("star")}Normie role set to **<@&${normieRole.join("")}>**!\n`
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;
    }

    client.createPrompt(detectPrompt)
}
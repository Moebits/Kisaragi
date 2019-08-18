exports.run = async (discord: any, message: any, args: string[]) => {
    let input = discord.combineArgs(args, 1);
    if (input.trim()) {
        message.content = input.trim();
        photoPrompt(message);
        return;
    }

    let channels = await discord.fetchColumn("images", "image channels");
    let folders = await discord.fetchColumn("images", "dropbox folders");
    let albums = await discord.fetchColumn("images", "google albums");
    let notify = await discord.fetchColumn("images", "notify toggle");
    let step = 3.0;
    let increment = Math.ceil(channels[0].length / step);
    let photosArray: any = [];
    for (let i = 0; i < increment; i++) {
        let description = "";
        for (let j = 0; j < step; j++) {
            if (channels[0] || folders[0] || albums[0]) {
                let value = (i*step)+j;
                if (!channels[0][value]) break;
                description += `**${value + 1} =>**\n` +
                `${discord.getEmoji("star")}Channel: ${channels[0] ? (channels[0][value] ? `<#${channels[0][value]}>` : "None") : "None"}\n` +
                `${discord.getEmoji("star")}Dropbox Folder: **${folders[0] ? (folders[0][value] ? folders[0][value] : "None") : "None"}**\n` +
                `${discord.getEmoji("star")}Google Album: **${albums[0] ? (albums[0][value] ? albums[0][value] : "None") : "None"}**\n`
            } else {
                description = "";
            }
        }
        let photoEmbed = discord.createEmbed();
        photoEmbed
        .setTitle(`**Photo Downloader/Uploader** ${discord.getEmoji("gabYes")}`)
        .setThumbnail(message.guild.iconURL)
        .setImage("https://i.imgur.com/AtAIFOb.png")
        .setDescription(
            "Automatically download and upload photos from a channel to dropbox/google photos!\n" +
            "\n" +
            "**Upload Notify** = Whether you will be notified whenever a photo is uploaded.\n" +
            "\n" +
            "__Current Settings__\n" +
            `${discord.getEmoji("star")}Upload notify is set to **${notify.join("")}**!\n` + 
            description +
            "\n" +
            "__Edit Settings__\n" +
            `${discord.getEmoji("star")}**Mention a channel** to set the channel.\n` +
            `${discord.getEmoji("star")}**Type a name** to set the google album name.\n` +
            `${discord.getEmoji("star")}**Use brackets [name]** to set the dropbox folder name.\n` +
            `${discord.getEmoji("star")}Type **edit (setting number)** to edit a setting.\n` +
            `${discord.getEmoji("star")}Type **delete (setting number)** to delete a setting.\n` +
            `${discord.getEmoji("star")}Type **reset** to delete all settings.\n` +
            `${discord.getEmoji("star")}Type **cancel** to exit.\n`
        )
        photosArray.push(photoEmbed);
    }
    
    discord.createReactionEmbed(photosArray);

    async function photoPrompt(msg: any) {
        let channels = await discord.fetchColumn("images", "image channels");
        let folders = await discord.fetchColumn("images", "dropbox folders");
        let albums = await discord.fetchColumn("images", "google albums");
        let notify = await discord.fetchColumn("images", "notify toggle");
        let responseEmbed = discord.createEmbed();
        let setChannel, setFolder, setAlbum, setNotify, setInit
        if (!channels[0]) channels = [[0]]; setInit = true;
        if (!folders[0]) folders = [[0]]; setInit = true;
        if (!albums[0]) albums = [[0]]; setInit = true;
        if (msg.content.toLowerCase() === "cancel") {
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`)
            msg.channel.send(responseEmbed);
            return;
        } 
        if (msg.content.toLowerCase() === "reset") {
            await discord.updateColumn("images", "image channels", null);
            await discord.updateColumn("images", "dropbox folders", null);
            await discord.updateColumn("images", "google albums", null);
            await discord.updateColumn("images", "notify toggle", "on");
            responseEmbed
            .setDescription(`${discord.getEmoji("star")}All settings were **reset**!`)
            msg.channel.send(responseEmbed);
            return;
        }
        if (msg.content.toLowerCase().startsWith("delete")) {
            let newMsg = Number(msg.content.replace(/delete/g, "").trim());
            let num = newMsg - 1;
            if (newMsg) {
                    channels[0][num] = 0;
                    albums[0][num] = 0;
                    folders[0][num] = 0;
                    channels[0] = channels[0].filter(Boolean);
                    albums[0] = albums[0].filter(Boolean);
                    folders[0]= folders[0].filter(Boolean);
                    await discord.updateColumn("images", "image channels", channels[0]);
                    await discord.updateColumn("images", "google albums", albums[0]);
                    await discord.updateColumn("images", "dropbox folders", folders[0]);   
                    return msg.channel.send(responseEmbed.setDescription(`Setting **${newMsg}** was deleted!`));
            } else {
                return msg.channel.send(responseEmbed.setDescription("Setting not found!"));
            }
        }
        if (msg.content.toLowerCase().startsWith("edit")) {
            let newMsg = msg.content.replace(/edit/g, "").trim().split(" ");
            let tempMsg = newMsg.slice(1).join(" ");
            let num = Number(newMsg[0]) - 1;
            if (tempMsg) {
                let newChan = tempMsg.match(/\d+/g);
                let newFolder = tempMsg.replace(/\d+/g, "").replace(/<#/g, "").replace(/>/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "")
                .replace(/\[/g, "").replace(/\]/g, "").replace(/notify/g, "").replace(/\s+/g, " ").trim();
                let newAlbum = tempMsg.match(/(?<=\[)(.*?)(?=\])/g);
                let editDesc = "";
                if (newChan) {
                    channels[0][num] = newChan;
                    await discord.updateColumn("images", "image channels", channels[0]);
                    editDesc += `${discord.getEmoji("star")}Channel set to **${newChan}**!\n`
                }
                if (newFolder) {
                    folders[0][num] = newFolder;
                    await discord.updateColumn("images", "dropbox folders", folders[0]);
                    editDesc += `${discord.getEmoji("star")}Dropbox folder set to **${newFolder}**!\n`
                }
                if (newAlbum) {
                    albums[0][num] = newAlbum;    
                    await discord.updateColumn("images", "google albums", albums[0]); 
                    editDesc += `${discord.getEmoji("star")}Google album set to **${newAlbum}**!\n`
                }
                return msg.channel.send(responseEmbed.setDescription(editDesc));
            } else {
                return msg.channel.send(responseEmbed.setDescription("No edits specified!"));
            }
        }
        let newChan = msg.content.match(/\d+/g);
        let newFolder = msg.content.replace(/\d+/g, "").replace(/<#/g, "").replace(/>/g, "").replace(/(?<=\[)(.*?)(?=\])/g, "")
        .replace(/\[/g, "").replace(/\]/g, "").replace(/notify/g, "").replace(/\s+/g, " ").trim();
        let newAlbum = msg.content.match(/(?<=\[)(.*?)(?=\])/g);

        if (msg.content.match(/notify/gi)) setNotify = true;
        if (newChan) setChannel = true;
        if (newFolder) setFolder = true;
        if (newAlbum) setAlbum = true;

        let description = "";

        if (setChannel) {
            channels[0].push(newChan);
            if (setInit) channels[0] = channels[0].filter(Boolean);
            await discord.updateColumn("images", "image channels", channels[0]);
            description += `${discord.getEmoji("star")}Channel set to <#${newChan}>!\n`
        }

        if (setFolder) {
            folders[0].push(newFolder);
            if (setInit) folders[0] = folders[0].filter(Boolean);
            await discord.updateColumn("images", "dropbox folders", folders[0]);
            description += `${discord.getEmoji("star")}Dropbox folder set to **${newFolder}**!\n`
        }

        if (setAlbum) {
            albums[0].push(newAlbum);
            if (setInit) albums[0] = albums[0].filter(Boolean);
            await discord.updateColumn("images", "google albums", albums[0]);
            description += `${discord.getEmoji("star")}Google album set to **${newAlbum}**!\n`
        }

        if (setNotify) {
            if (notify.join("") === "on") {
                await discord.updateColumn("images", "notify toggle", "off");
                description += `${discord.getEmoji("star")}Upload notify is **off**!\n` 
            } else {
                await discord.updateColumn("images", "notify toggle", "on");
                description += `${discord.getEmoji("star")}Upload notify is **on**!\n` 
            }
        }

        responseEmbed
        .setDescription(description)
        msg.channel.send(responseEmbed);
        return;

    }

    discord.createPrompt(photoPrompt);
}
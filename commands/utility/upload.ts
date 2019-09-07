exports.run = async (discord: any, message: any, args: string[]) => {
    let channels = await discord.fetchColumn("images", "image channels");
    //let folders = await discord.fetchColumn("images", "dropbox folders");
    let albums = await discord.fetchColumn("images", "google albums");
    let notify = await discord.fetchColumn("images", "notify toggle");

    if (!channels[0]) return;

    const GPhotos = require("upload-gphotos").default;
    const gphotos = new GPhotos({username: process.env.GOOGLE_EMAIL, password: process.env.GOOGLE_PASSWORD});
    await gphotos.login();
    const download = require('image-downloader');
    //const Dropbox = require('dropbox').Dropbox;
    //const fetch = require('isomorphic-fetch');
    const fs = require("fs");

    /*let dropbox = new Dropbox({
        fetch: fetch,
        accessToken: process.env.DROPBOX_ACCESS_TOKEN
    });*/

    async function downloadImage(onlinePhoto: string[], channelName: string) {
        let dir = `../assets/images/channels/${channelName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let {filename} = await download.image({url: onlinePhoto, dest: dir});
        return filename;
    }

    async function gatherPhotos(guildChannel: any) {
        let channel = message.guild.channels.find((c: any) => c.id === guildChannel);
        let done = false;
        let counter = 0;
        let photoArray: any = [];
        while (!done) {
            setTimeout(async () => {
                let notMsg;
                if (notify[0] === "on") {
                    notMsg = await channel.send(`Downloaded **${counter}** images in this channel. This will take awhile, please be patient. ${discord.getEmoji("gabCircle")}`);
                }
                let messages = await channel.fetchMessages({limit: 100});
                messages = messages.map((m: any) => m);
                for (let i = 0; i < messages.length; i++) {
                    if (!messages[i]) {
                        done = true;
                        break;
                    }
                    if (messages[i].attachments.size) {
                        let attachments = messages[i].attachments.map((a: any) => a);
                        console.log(attachments);
                        for (let j = 0; j < attachments.length; j++) {
                            let photo = await downloadImage(attachments[j].url, channel.name);
                            photoArray.push(photo);
                            counter++;
                        }
                    }
                }
                if (notMsg) await notMsg.delete();
            }, 30000);
        }
        return photoArray;
    }

    async function uploadToAlbum(photos: string[], albumName: string, guildChannel: any) {
        let channel = message.guild.channels.find((c: any) => c.id === guildChannel);
        const album = await gphotos.searchOrCreateAlbum(albumName);
        let notMsg;
        if (notify[0] === "on") {
            notMsg = await channel.send(`Uploading images to google photos. Please be patient ${discord.getEmoji("gabCircle")}`);
        }
        for (let i = 0; i < photos.length; i++) {
            let photo = await gphotos.upload(photos[i]);
            await album.addPhoto(photo);
        }
        if (notMsg) await notMsg.delete();
        let gPhotosEmbed = discord.createEmbed();
        gPhotosEmbed
        .setTitle(`**Google Photos Upload** ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${discord.getEmoji("star")}Uploading finished! You can find the pictures at **https://photos.google.com/share/${album.id}**!`
        )
        await channel.send(gPhotosEmbed);
    }

    /*async function uploadToFolder(photos: string[], folderName: string, guildChannel: any) {
        let channel = message.guild.channels.find((c: any) => c.id === guildChannel);
        let folder = await dropbox.filesCreateFolder(`${channel.guild.name}/${folderName}`);
        let notMsg;
        if (notify[0] === "on") {
            notMsg = await channel.send(`Uploading images to dropbox. Please be patient ${discord.getEmoji("gabCircle")}`);
        }
        for (let i = 0; i < photos.length; i++) {
            await dropbox.filesUpload({
                contents: photos[i],
                path: folder.path
            });
        }
        if (notMsg) await notMsg.delete();
        let link = await dropbox.sharingCreateSharedLink(folder.path);
        let dropboxEmbed = discord.createEmbed();
        dropboxEmbed
        .setTitle(`**Dropbox Upload** ${discord.getEmoji("gabYes")}`)
        .setDescription(
            `${discord.getEmoji("star")}Uploading finished! You can find the pictures at **${link.url}**!`
        )
        await channel.send(dropboxEmbed);
    }*/

    for (let i = 0; i < channels.length; i++) {
        let photos = await gatherPhotos(channels[0][i]);
        if (albums[0][i]) await uploadToAlbum(photos, albums[0][i], channels[0][i]);
        //if (folders[0][i]) await uploadToFolder(photos, folders[0][i], channels[0][i]);
    }
}
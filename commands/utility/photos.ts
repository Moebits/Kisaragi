exports.run = async (client: any, message: any, args: string[]) => {
    const {GPhotos} = require("upload-gphotos");
    const photos = new GPhotos({username: process.env.GOOGLE_EMAIL, password: process.env.GOOGLE_PASSWORD});
    await photos.login();
    let channelName = args[1];
    let albumName = args[2];
    let channel;

    if (typeof Number(channelName) === "number") {
        channel = client.channels.get(Number(channelName));
    } else {
        channel = message.member.guild.channels.find((channel: any) => channel.name === channelName);
    }

    let album = await photos.searchAlbum(albumName);
    if (!album || !channel) {
        return;
    }

    let attachmentArray = client.fetchChannelAttachments(channel);

    for (let i = 0; i < attachmentArray.length; i++) { 
        const photo = await photos.upload(attachmentArray[i]);
        await album.addPhoto(photo);
    }
}
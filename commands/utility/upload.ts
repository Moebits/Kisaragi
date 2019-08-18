exports.run = async (discord: any, message: any, args: string[]) => {
    let channels = await discord.fetchColumn("images", "image channels");
    //let folders = await discord.fetchColumn("images", "dropbox folders");
    //let albums = await discord.fetchColumn("images", "google albums");
    //let notify = await discord.fetchColumn("images", "notify toggle");

    if (!channels[0]) return;

    const {GPhotos} = require("upload-gphotos");
    const gphotos = new GPhotos({username: process.env.GOOGLE_EMAIL, password: process.env.GOOGLE_PASSWORD});
    await gphotos.login();
}
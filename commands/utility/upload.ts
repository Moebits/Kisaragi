exports.run = async (client: any, message: any, args: string[]) => {
    let channels = await client.fetchColumn("images", "image channels");
    let folders = await client.fetchColumn("images", "dropbox folders");
    let albums = await client.fetchColumn("images", "google albums");
    let notify = await client.fetchColumn("images", "notify toggle");

    if (!channels[0]) return;

    const {GPhotos} = require("upload-gphotos");
    const gphotos = new GPhotos({username: process.env.GOOGLE_EMAIL, password: process.env.GOOGLE_PASSWORD});
    await gphotos.login();
}
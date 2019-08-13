module.exports = async (client: any, message: any) => {

    const cv = require('opencv4nodejs');
    const download = require('image-downloader')
    const classifier = new cv.CascadeClassifier("../assets/cascades/animeface.xml");

    client.detectAnime = async (msg: any) => {
        if (msg.author.id === client.user.id) return;
        if (msg.attachments.size) {
            let urls = msg.attachments.map((a) => a.url);
            for (let i = 0; i < urls.length; i++) {
                console.log(urls)
                await download.image({url: urls[i], dest: `../assets/detection/image${i}.jpg`});
                const img = await cv.imreadAsync(`../assets/detection/image${i}.jpg`);
                const grayImg = await img.bgrToGrayAsync();
                const {objects} = await classifier.detectMultiScaleAsync(grayImg);
                if (!objects.join("")) {
                    await msg.reply("You can only post anime pictures!");
                    await msg.delete();
                }
            }
        }
    }
}
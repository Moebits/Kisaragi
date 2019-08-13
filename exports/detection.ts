module.exports = async (client: any, message: any) => {

    let cv = require("opencv");
    const download = require('image-downloader')

    client.detectAnime = async (msg: any) => {
        if (msg.author.id === client.user.id) return;
        if (msg.attachments.size) {
            let urls = msg.attachments.map((a) => a.url);
            for (let i = 0; i < urls.length; i++) {
                console.log(urls)
                await download.image({url: urls[i], dest: `../assets/detection/image${i}.jpg`});
                cv.readImage(`../assets/detection/image${i}.jpg`, function(err, im){
                    im.detectObject("../assets/cascades/animeface.xml", {}, async function(err, faces) {
                        if (!faces.join("")) {
                            await msg.reply("You can only post anime pictures!");
                            await msg.delete();
                        }
                    });
                  });
            }
        }
    }
}
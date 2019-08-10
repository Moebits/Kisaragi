module.exports = async (client: any, message: any) => {

    const deepai = require('deepai');

    deepai.setApiKey(process.env.DEEP_API_KEY);

    client.detectFace = async (msg: any) => {

        if (msg.attachments) {
            let urls = msg.attachments.map((a: any) => a.url);
            for (let i = 0; i < urls.length; i++) {
                let response = await deepai.callStandardApi("facial-recognition", {
                    image: urls[i]
                });
                let confidenceArray = response.output.faces.map((f: any) => f.confidence);
                console.log(confidenceArray)
                for (let i = 0; i < confidenceArray.length; i++) {
                    if (confidenceArray[i] === "1.0") {
                        msg.reply("Your post was removed because a 3D human was detected.")
                        await msg.delete();
                    }
                }
            }
        }
    }
}
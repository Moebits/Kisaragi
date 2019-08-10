exports.run = async (client: any, message: any, args: string[]) => {
    let imgUrl;
    if (!args[1]) {
        let messages = await message.channel.fetchMessages({limit: 10});
        let imgUrls = messages.filter((m: any) => m.attachments.size);
        imgUrl = imgUrls.first().attachments.first().url;
    } else {
        imgUrl = args[1];
    }

    const deepai = require('deepai');
    deepai.setApiKey(process.env.DEEP_API_KEY);

    let response = await deepai.callStandardApi("waifu2x", {
        image: imgUrl
    });
    
    let waifuEmbed = client.createEmbed();
    waifuEmbed
    .setAuthor("waifu2x", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9hWZ1ptE9IrNWOUqHzcf9OFD7RMMQEXeUwqpE3zCMB8PWD8Caeg")
    .setTitle(`**Waifu 2x Image Resizing** ${client.getEmoji("gabYes")}`)
    .setURL(response.output_url)
    .setImage(response.output_url)
    message.channel.send(waifuEmbed)

}
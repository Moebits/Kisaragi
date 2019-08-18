exports.run = async (discord: any, message: any, args: string[]) => {
    const GoogleImages = require('google-images');
    let query = discord.combineArgs(args, 1);
    console.log(query)
 
    const images = new GoogleImages(process.env.GOOGLE_IMAGES_ID, process.env.GOOGLE_API_KEY);
    
    let result = await images.search(query);
    let imagesArray: any = [];
    for (let i in result) {
        let imageEmbed = discord.createEmbed();
        let size = Math.floor(result[i].size/1024);
        imageEmbed
        .setAuthor("google images", "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png")
        .setURL(result[i].parentPage)
        .setTitle(`**Image Search** ${discord.getEmoji("raphi")}`)
        .setDescription(
            `${discord.getEmoji("star")}_Website:_ ${result[i].parentPage}\n` +
            `${discord.getEmoji("star")}_Width:_ ${result[i].width} _Height:_ ${result[i].height}\n` +
            `${discord.getEmoji("star")}_Filesize:_ ${size}KB\n` +
            `${discord.getEmoji("star")}_Description:_ ${result[i].description}`
        )
        .setImage(result[i].url)
        imagesArray.push(imageEmbed);
    }
    discord.createReactionEmbed(imagesArray);
}
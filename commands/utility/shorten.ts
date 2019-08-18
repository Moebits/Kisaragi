exports.run = async (discord: any, message: any, args: string[]) => {
    const axios = require('axios');
    let input = discord.combineArgs(args, 1);
    let json = await axios.get(`https://is.gd/create.php?format=json&url=${input.trim()}`)
    let newLink = json.data.shorturl;
    message.channel.send(newLink)
}
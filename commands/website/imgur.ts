exports.run = async (client: any, message: any, args: string[]) => {
    
    const imgur = require('imgur');
    await imgur.setClientId(process.env.IMGUR_CLIENT_ID);
    await imgur.getClientId();
    await imgur.setAPIUrl('https://api.imgur.com/');
    await imgur.getAPIUrl();

    var query = client.combineArgs(args, 1);
    let json = await imgur.search(query);
    console.log(json)
}
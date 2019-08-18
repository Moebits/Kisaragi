exports.run = async (discord: any, message: any, args: string[]) => {
    const SoundCloud = require('soundcloud-api-discord');
 
    const clientId = "9aB60VZycIERY07OUTVBL5GeErnTA0E4";
    const soundcloud = new SoundCloud({clientId});
    
    const query = discord.combineArgs(args, 1)
    
    let tracks = await soundcloud.get('/tracks', {query})
    console.log(tracks)
 

}
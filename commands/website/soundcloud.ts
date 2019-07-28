exports.run = async (client: any, message: any, args: string[]) => {
    const SoundCloud = require('soundcloud-api-client');
 
    const clientId = "9aB60VZycIERY07OUTVBL5GeErnTA0E4";
    const soundcloud = new SoundCloud({clientId});
    
    const query = client.combineArgs(args, 1)
    
    let tracks = await soundcloud.get('/tracks', {query})
    console.log(tracks)
 

}
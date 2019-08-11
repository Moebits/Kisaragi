exports.run = async (client: any, message: any, args: string[]) => {
    let Spotify = require('node-spotify-api');
    let ms = require("pretty-ms");
 
    let spotify = new Spotify({
        id: process.env.SPOTIFY_CLIENT_ID,
        secret: process.env.SPOTIFY_CLIENT_SECRET
    });

    if (args[1] === "artist") {
        let query = client.combineArgs(args, 2);
        let response = await spotify.search({type: "artist", query: query.trim()});
        let artist = response.artists.items[0];
        let spotifyEmbed = client.createEmbed();
        spotifyEmbed
        .setAuthor("spotify", "https://www.freepnglogos.com/uploads/spotify-logo-png/image-gallery-spotify-logo-21.png")
        .setTitle(`**Spotify Artist** ${client.getEmoji("aquaUp")}`)
        .setURL(artist.external_urls.spotify)
        .setImage(artist.images[0].url)
        .setDescription(
            `${client.getEmoji("star")}_Artist:_ **${artist.name}**\n` +
            `${client.getEmoji("star")}_Genres:_ **${artist.genres.join(", ")}**\n` +
            `${client.getEmoji("star")}_Followers:_ **${artist.followers.total}**\n` +
            `${client.getEmoji("star")}_Popularity:_ **${artist.popularity}**\n`
        )
        message.channel.send(spotifyEmbed);
        return;
    }

    let query = client.combineArgs(args, 1);
    let response = await spotify.search({type: "track", query: query.trim()});
    let spotifyArray: any = [];
    for (let i = 0; i < response.tracks.items.length; i++) {
        let track = response.tracks.items[i];
        let artists = track.artists.map((a: any) => a.name);
        let artistResponse = await spotify.search({type: "artist", query: artists[0]});
        let image = artistResponse.artists.items[0].images[0].url;
        let spotifyEmbed = client.createEmbed();
        spotifyEmbed
        .setAuthor("spotify", "https://www.freepnglogos.com/uploads/spotify-logo-png/image-gallery-spotify-logo-21.png")
        .setTitle(`**Spotify Search** ${client.getEmoji("aquaUp")}`)
        .setImage(track.album.images[0].url)
        .setThumbnail(image)
        .setURL(track.external_urls.spotify)
        .setDescription(
            `${client.getEmoji("star")}_Track:_ **${track.name}**\n` +
            `${client.getEmoji("star")}_Artists:_ **${artists.join(", ")}**\n` +
            `${client.getEmoji("star")}_Album:_ **${track.album.name}**\n` +
            `${client.getEmoji("star")}_Tracks:_ **${track.album.total_tracks}**\n` +
            `${client.getEmoji("star")}_Release Date:_ **${client.formatDate(track.album.release_date)}**\n` +
            `${client.getEmoji("star")}_Duration:_ **${ms(track.duration_ms, {secondsDecimalDigits: 0})}**\n` +
            `${client.getEmoji("star")}_Popularity:_ **${track.popularity}**\n`
        )
        spotifyArray.push(spotifyEmbed);
    }
    client.createReactionEmbed(spotifyArray);
}
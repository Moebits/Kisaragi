exports.run = async (client: any, message: any, args: string[]) => {

    const {YouTube} = require('better-youtube-api');
    const youtube = new YouTube(process.env.GOOGLE_API_KEY);
    const youtubeEmbed = client.createEmbed();
    const axios = require('axios');

    if (args[1].toLowerCase() === "channel") {
        let channelLink = client.combineArgs(args, 2);
        if (!channelLink.startsWith("https")) {
            let channelResult = await youtube.searchChannels(channelLink);
            channelLink = channelResult[0].url;
        }
        let channel = await youtube.getChannelByUrl(channelLink);
        let channelBanner = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channel.id}&key=${process.env.GOOGLE_API_KEY}`);
        let keywords = channelBanner.data.items[0].brandingSettings.channel.keywords;
        let channelBannerUrl = channelBanner.data.items[0].brandingSettings.image.bannerImageUrl;
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**Youtube Channel** ${client.getEmoji("kannaWave")}`)
        .setURL(``)
        .setDescription(
        `${client.getEmoji("star")}_Channel:_ **${channel.name}**\n` +
        `${client.getEmoji("star")}_Custom URL:_ **${channel.data.snippet.customUrl ? `https://youtube.com/c/${channel.data.snippet.customUrl}` : "None"}**\n` +
        `${client.getEmoji("star")}_Keywords:_ ${keywords ? keywords : "None"}\n` +
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(channel.dateCreated)}**\n` +
        `${client.getEmoji("star")}_Country:_ ${channel.country}\n` +
        `${client.getEmoji("star")}_Subscribers:_ **${channel.subCount}** _Views:_ **${channel.views}**\n` +
        `${client.getEmoji("star")}_Videos:_ **${channel.data.statistics.videoCount}**\n` +
        `${client.getEmoji("star")}_About:_ ${client.checkChar(channel.about, 1800, ".")}\n` 
        )
        .setThumbnail(channel.profilePictures.high.url)
        .setImage(channelBannerUrl)
        message.channel.send(youtubeEmbed);
        return;
    }

    if (args[1].toLowerCase() === "playlist") {
        let playLink = client.combineArgs(args, 2);
        if (!playLink.startsWith("https")) {
            let playlistResult = await youtube.searchPlaylists(playLink);
            playLink = `https://www.youtube.com/playlist?list=${playlistResult[0].id}`;
        }
        let playlist = await youtube.getPlaylistByUrl(playLink);
        let ytChannel = await youtube.getChannel(playlist.creatorId);
        let videos = await playlist.fetchVideos(5);
        let videoArray: string[] = [];
        for (let i = 0; i <= 5; i++) {
            if (!videos[i]) break;
            videoArray.push(`**${videos[i].title}**\n`)
        }
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**Youtube Playlist** ${client.getEmoji("kannaWave")}`)
        .setURL(`https://www.youtube.com/playlist?list=${playlist.id}`)
        .setDescription(
        `${client.getEmoji("star")}_Title_: **${playlist.title}**\n` +
        `${client.getEmoji("star")}_Channel:_ **${ytChannel.name}**\n` +
        `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(playlist.dateCreated)}**\n` +
        `${client.getEmoji("star")}_Tags:_ ${playlist.tags ? playlist.tags : "None"}\n` +
        `${client.getEmoji("star")}_Video Count:_ **${playlist.length}**\n` +
        `${client.getEmoji("star")}_Description:_ ${playlist.data.snippet.description ? playlist.data.snippet.description : "None"}\n` +
        `${client.getEmoji("star")}_Videos:_ ${videoArray.join(" ") ? videoArray.join(" ") : "None"}\n`
        )
        .setThumbnail(ytChannel.profilePictures.high ? ytChannel.profilePictures.high.url : ytChannel.profilePictures.medium.url)
        .setImage(playlist.thumbnails.maxres ? playlist.thumbnails.maxres.url : playlist.thumbnails.high.url);
        message.channel.send(youtubeEmbed);
        return;
    }

    if (args[1].toLowerCase() === "video") {
        let videoLink = client.combineArgs(args, 2);
        if (!videoLink.startsWith("https")) {
            let videoResult = await youtube.searchVideos(videoLink);
            videoLink = videoResult[0].shortUrl;
        }
        const video = await youtube.getVideoByUrl(videoLink)
        let comments = await video.fetchComments(5);
        let commentArray: string[] = [];
        for (let i = 0; i <= 5; i++) {
            if (!comments[i]) break;
            commentArray.push(`**${comments[i].author.username}:** ${comments[i].text.displayed}\n`)
        }
        let ytChannel = await youtube.getChannel(video.channelId)
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**Youtube Video** ${client.getEmoji("kannaWave")}`)
        .setURL(video.shortUrl)
        .setDescription(
        `${client.getEmoji("star")}_Title:_ **${video.title}**\n` +
        `${client.getEmoji("star")}_Channel:_ **${ytChannel.name}**\n` +
        `${client.getEmoji("star")}_Views:_ **${video.views}**\n` +
        `${client.getEmoji("star")} ${client.getEmoji("up")} **${video.likes}** ${client.getEmoji("down")} **${video.dislikes}**\n` +
        `${client.getEmoji("star")}_Date Published:_ **${client.formatDate(video.datePublished)}**\n` +
        `${client.getEmoji("star")}_Description:_ ${video.description ? client.checkChar(video.description, 1700, ".") : "None"}\n` +
        `${client.getEmoji("star")}_Comments:_ ${commentArray.join(" ") ? commentArray.join(" ") : "None"}\n` 
        )
        .setThumbnail(ytChannel.profilePictures.high.url)
        .setImage(video.thumbnails.maxres.url);
        message.channel.send(youtubeEmbed);
        return;
    }

    if (args[1].toLowerCase() === "search") {
        switch (args[2].toLowerCase()) {
            case "channel":
                let channelResults = await youtube.searchChannels(client.combineArgs(args, 3));
                for (let i = 0; i < 10; i++) {
                    youtubeEmbed
                    .addField("**Channel**", channelResults[i].name)
                    .addField("**Link**", channelResults[i].data.snippet.customUrl ? `https://youtube.com/c/${channelResults[i].data.snippet.customUrl}` : channelResults[i].url)
                }
                youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**Search Results** ${client.getEmoji("kannaWave")}`)
                .setThumbnail(message.author.displayAvatarURL);
                message.channel.send(youtubeEmbed);
                break;

            case "playlist":
                let playlistResults = await youtube.searchPlaylists(client.combineArgs(args, 3));
                for (let i = 0; i < 10; i++) {
                    youtubeEmbed
                    .addField("**Playlist**", playlistResults[i].title)
                    .addField("**Link**", `https://www.youtube.com/playlist?list=${playlistResults[i].id}`)        
                }
                youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**Search Results** ${client.getEmoji("kannaWave")}`)
                .setThumbnail(message.author.displayAvatarURL);
                message.channel.send(youtubeEmbed);
                break;

            case "video":
                let videoResults = await youtube.searchVideos(client.combineArgs(args, 3));
                for (let i = 0; i < 10; i++) {
                    youtubeEmbed
                    .addField("**Video**", videoResults[i].title)
                    .addField("**Link**", videoResults[i].shortUrl)
                }
                youtubeEmbed
                .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
                .setTitle(`**Search Results** ${client.getEmoji("kannaWave")}`)
                .setThumbnail(message.author.displayAvatarURL);
                message.channel.send(youtubeEmbed);
                break;
        }
    }

    //If no params, defaults to search video
    let videoResults = await youtube.searchVideos(client.combineArgs(args, 2));
    for (let i = 0; i < 10; i++) {
        youtubeEmbed
        .addField("**Video**", videoResults[i].title)
        .addField("**Link**", videoResults[i].shortUrl)
    }
    youtubeEmbed
    .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
    .setTitle(`**Search Results** ${client.getEmoji("kannaWave")}`)
    .setThumbnail(message.author.displayAvatarURL);
    message.channel.send(youtubeEmbed);
}
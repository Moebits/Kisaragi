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
        .setTitle(`**Youtube Channel** ${client.getEmoji("kannaWave")}`)
        .addField("**Channel**", channel.name)
        .addField("**Link**", channel.data.snippet.customUrl ? `https://youtube.com/c/${channel.data.snippet.customUrl}` : channel.url)
        .addField("**Keywords**", keywords ? keywords : "None")
        .addField("**Date Created**", client.formatDate(channel.dateCreated), true)
        .addField("**Country**", channel.country, true)
        .addField("**Subscribers**", channel.subCount)
        .addField("**Views**", channel.views)
        .addField("**Videos**", channel.data.statistics.videoCount)
        .addField("**About**", channel.about)
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
        let videoArray = [];
        for (let i = 0; i <= 5; i++) {
            if (!videos[i]) break;
            videoArray.push(`**${videos[i].title}**\n`)
        }
        youtubeEmbed
        .setTitle(`**Youtube Playlist** ${client.getEmoji("kannaWave")}`)
        .addField("**Title**", playlist.title)
        .addField("**Channel**", ytChannel.name)
        .addField("**Link**", `https://www.youtube.com/playlist?list=${playlist.id}`)
        .addField("**HTML Embed**", playlist.embedHtml)
        .addField("**Date Created**", client.formatDate(playlist.dateCreated))
        .addField("**Tags**", playlist.tags ? playlist.tags : "None")
        .addField("**Video Count**", playlist.length)
        .addField("**Description**", playlist.data.snippet.description ? playlist.data.snippet.description : "None")
        .addField("**Videos**", videoArray.join(" ") ? videoArray.join(" ") : "None")
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
        let commentArray = [];
        for (let i = 0; i <= 5; i++) {
            if (!comments[i]) break;
            commentArray.push(`**${comments[i].author.username}:** ${comments[i].text.displayed}\n`)
        }
        let ytChannel = await youtube.getChannel(video.channelId)
        youtubeEmbed
        .setTitle(`**Youtube Video** ${client.getEmoji("kannaWave")}`)
        .addField("**Title**", video.title)
        .addField("**Channel**", ytChannel.name)
        .addField("**Link**", video.shortUrl)
        .addField("**Views**", video.views)
        .addField("**Likes**", video.likes, true)
        .addField("**Dislikes**", video.dislikes, true)
        .addField("**Date Published**", client.formatDate(video.datePublished))
        .addField("**Description**", video.description ? video.description : "None")
        .addField("**Comments**", commentArray.join(" ") ? commentArray.join(" ") : "None")
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
    .setTitle(`**Search Results** ${client.getEmoji("kannaWave")}`)
    .setThumbnail(message.author.displayAvatarURL);
    message.channel.send(youtubeEmbed);
}
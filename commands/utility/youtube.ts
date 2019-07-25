exports.run = async (client: any, message: any, args: string[]) => {

    const {YouTube} = require('better-youtube-api');
    const youtube = new YouTube(process.env.GOOGLE_API_KEY);
    const axios = require('axios');
    let ytEmbeds: any = [];

    let msg = await message.channel.send(`**Searching youtube** ${client.getEmoji("gabCircle")}`);

    client.ytChannelEmbed = async (channelLink: any) => {
        let channel = await youtube.getChannelByUrl(channelLink);
        let channelBanner = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channel.id}&key=${process.env.GOOGLE_API_KEY}`);
        let keywords = channelBanner.data.items[0].brandingSettings.channel.keywords;
        let channelBannerUrl = channelBanner.data.items[0].brandingSettings.image.bannerImageUrl;
        let youtubeEmbed = client.createEmbed();
        youtubeEmbed
        .setAuthor("youtube", "https://cdn4.iconfinder.com/data/icons/social-media-2210/24/Youtube-512.png")
        .setTitle(`**Youtube Channel** ${client.getEmoji("kannaWave")}`)
        .setURL(channel.url)
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
        ytEmbeds.push(youtubeEmbed);
    }

    client.ytPlaylistEmbed = async (playLink: any) => {
        let playlist = await youtube.getPlaylistByUrl(playLink);
        let ytChannel = await youtube.getChannel(playlist.creatorId);
        let videos = await playlist.fetchVideos(5);
        let videoArray: string[] = [];
        for (let i = 0; i <= 5; i++) {
            if (!videos[i]) break;
            videoArray.push(`**${videos[i].title}**\n`)
        }
        let youtubeEmbed = client.createEmbed();
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
        ytEmbeds.push(youtubeEmbed);
    }

    client.ytVideoEmbed = async (videoLink: any) => {
        const video = await youtube.getVideoByUrl(videoLink)
        let comments = await video.fetchComments(5);
        let commentArray: string[] = [];
        for (let i = 0; i <= 5; i++) {
            if (!comments[i]) break;
            commentArray.push(`**${comments[i].author.username}:** ${comments[i].text.displayed}\n`)
        }
        let ytChannel = await youtube.getChannel(video.channelId)
        let youtubeEmbed = client.createEmbed();
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
        `${client.getEmoji("star")}_Description:_ ${video.description ? client.checkChar(video.description, 1500, ".") : "None"}\n` +
        `${client.getEmoji("star")}_Comments:_ ${commentArray.join(" ") ? client.checkChar(commentArray.join(" "), 200, ".") : "None"}\n` 
        )
        .setThumbnail(ytChannel.profilePictures.high.url)
        .setImage(video.thumbnails.maxres.url);
        ytEmbeds.push(youtubeEmbed);
    }

    if (args[1].toLowerCase() === "channel") {
        ytEmbeds = [];
        let channelLink = client.combineArgs(args, 2);
        if (!channelLink.startsWith("https")) {
            let channelResult = await youtube.searchChannels(channelLink);
            let length = channelResult.length < 10 ? channelResult.length : 10;
            for (let i = 0; i < length; i++) {
                if (!channelResult[i]) break;
                channelLink = channelResult[i].url;
                await client.ytChannelEmbed(channelLink);
            }
            client.createReactionEmbed(ytEmbeds, true);
            msg.delete(1000);
            return;
        }
        await client.ytChannelEmbed(channelLink);
        message.channel.send(ytEmbeds[0]);
        msg.delete(1000);
        return;
    }

    if (args[1].toLowerCase() === "playlist") {
        ytEmbeds = [];
        let playLink = client.combineArgs(args, 2);
        if (!playLink.startsWith("https")) {
            let playlistResult = await youtube.searchPlaylists(playLink);
            let length = playlistResult.length < 10 ? playlistResult.length : 10;
            for (let i = 0; i < length; i++) {
                if (!playlistResult[i]) break;
                playLink = `https://www.youtube.com/playlist?list=${playlistResult[i].id}`;
                await client.ytPlaylistEmbed(playLink);
            }
            client.createReactionEmbed(ytEmbeds, true);
            msg.delete(1000);
            return;
        }
        await client.ytPlaylistEmbed(playLink);
        message.channel.send(ytEmbeds[0]);
        msg.delete(1000);
        return;
    }

    if (args[1].toLowerCase() === "video") {
        ytEmbeds = [];
        let videoLink = client.combineArgs(args, 2);
        if (!videoLink.startsWith("https")) {
            let videoResult = await youtube.searchVideos(videoLink);
            for (let i = 0; i < videoResult.length; i++) {
                if (!videoResult[i]) break;
                videoLink = videoResult[i].url;
                await client.ytVideoEmbed(videoLink);
            }
            client.createReactionEmbed(ytEmbeds, true);
            msg.delete(1000);
            return;
        }
        await client.ytVideoEmbed(videoLink);
        message.channel.send(ytEmbeds[0]);
        msg.delete(1000);
        return;
    }
}
exports.run = async (client: any, message: any, args: string[]) => {
    const GitHub = require('github-api');
    const axios = require("axios");
    const github = new GitHub({
        token: process.env.GITHUB_ACCESS_TOKEN
    });

    if (args[1].toLowerCase() === "user") {
        let input = client.combineArgs(args, 2);
        const user = github.getUser(input.trim());
        let json = await user.getProfile();
        let result = json.data;
        let githubEmbed = client.createEmbed();
        githubEmbed
        .setAuthor("github", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
        .setTitle(`**Github Search** ${client.getEmoji("raphi")}`)
        .setURL(result.html_url)
        .setDescription(
            `${client.getEmoji("star")}_Name:_ **${result.login}**\n` +
            `${client.getEmoji("star")}_Link:_ **${result.html_url}**\n` +
            `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(result.created_at)}**\n` +
            `${client.getEmoji("star")}_Updated:_ **${client.formatDate(result.updated_at)}**\n` +
            `${client.getEmoji("star")}_Location:_ **${result.location}**\n` +
            `${client.getEmoji("star")}_Repositories:_ **${result.public_repos}**\n` +
            `${client.getEmoji("star")}_Followers:_ **${result.followers}**\n` +
            `${client.getEmoji("star")}_Following:_ **${result.following}**\n` +
            `${client.getEmoji("star")}_Email:_ **${result.email ? result.email : "None"}**\n` +
            `${client.getEmoji("star")}_Bio:_ ${result.bio}\n`
        )
        .setThumbnail(result.avatar_url)
        message.channel.send(githubEmbed);
        return;
    }

    let input = client.combineArgs(args, 1);
    const search = github.search({q: input.trim()});
    let json = await search.forRepositories();
    let result = json.data;
    let githubArray: any = [];
    for (let i = 0; i < 10; i++) {
        let source = await axios.get(result[i].html_url);
        let regex = /<meta[^>]+name="twitter:image:src"[^>]+content="?([^"\s]+)"?\s*\/>/g;
        let urls: any = [];
        let m;
        while (m = regex.exec(source.data)) {
            urls.push(m[1]);
        }
        let githubEmbed = client.createEmbed();
        githubEmbed
        .setAuthor("github", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
        .setTitle(`**Github Search** ${client.getEmoji("raphi")}`)
        .setURL(result[i].html_url)
        .setDescription(
            `${client.getEmoji("star")}_Name:_ **${result[i].name}**\n` +
            `${client.getEmoji("star")}_Author:_ **${result[i].owner.login}**\n` +
            `${client.getEmoji("star")}_Link:_ **${result[i].html_url}**\n` +
            `${client.getEmoji("star")}_Language:_ **${result[i].language}**\n` +
            `${client.getEmoji("star")}_Stargazers:_ **${result[i].stargazers_count}**\n` +
            `${client.getEmoji("star")}_Forks:_ **${result[i].forks_count}**\n` +
            `${client.getEmoji("star")}_Open Issues:_ **${result[i].open_issues}**\n` +
            `${client.getEmoji("star")}_Watchers:_ **${result[i].watchers_count}**\n` +
            `${client.getEmoji("star")}_Creation Date:_ **${client.formatDate(result[i].created_at)}**\n` +
            `${client.getEmoji("star")}_Updated:_ **${client.formatDate(result[i].updated_at)}**\n` +
            `${client.getEmoji("star")}_Description:_ ${result[i].description}\n`
        )
        .setThumbnail(result[i].owner.avatar_url)
        .setImage(urls[0])
        githubArray.push(githubEmbed);
    }
    client.createReactionEmbed(githubArray);
}
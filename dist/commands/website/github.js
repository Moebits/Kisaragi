"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const github_api_1 = __importDefault(require("github-api"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Github extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const github = new github_api_1.default({
                token: process.env.GITHUB_ACCESS_TOKEN
            });
            if (args[1].toLowerCase() === "user") {
                const input = Functions_1.Functions.combineArgs(args, 2);
                const user = github.getUser(input.trim());
                const json = yield user.getProfile();
                const result = json.data;
                const githubEmbed = embeds.createEmbed();
                githubEmbed
                    .setAuthor("github", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
                    .setTitle(`**Github Search** ${discord.getEmoji("raphi")}`)
                    .setURL(result.html_url)
                    .setDescription(`${discord.getEmoji("star")}_Name:_ **${result.login}**\n` +
                    `${discord.getEmoji("star")}_Link:_ **${result.html_url}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(result.created_at)}**\n` +
                    `${discord.getEmoji("star")}_Updated:_ **${Functions_1.Functions.formatDate(result.updated_at)}**\n` +
                    `${discord.getEmoji("star")}_Location:_ **${result.location}**\n` +
                    `${discord.getEmoji("star")}_Repositories:_ **${result.public_repos}**\n` +
                    `${discord.getEmoji("star")}_Followers:_ **${result.followers}**\n` +
                    `${discord.getEmoji("star")}_Following:_ **${result.following}**\n` +
                    `${discord.getEmoji("star")}_Email:_ **${result.email ? result.email : "None"}**\n` +
                    `${discord.getEmoji("star")}_Bio:_ ${result.bio}\n`)
                    .setThumbnail(result.avatar_url);
                message.channel.send(githubEmbed);
                return;
            }
            const input = Functions_1.Functions.combineArgs(args, 1);
            const search = github.search({ q: input.trim() });
            const json = yield search.forRepositories();
            const result = json.data;
            const githubArray = [];
            for (let i = 0; i < 10; i++) {
                const source = yield axios_1.default.get(result[i].html_url);
                const regex = /<meta[^>]+name="twitter:image:src"[^>]+content="?([^"\s]+)"?\s*\/>/g;
                const urls = [];
                const m = regex.exec(source.data);
                if (m !== null) {
                    for (let i = 0; i < m.length; i++) {
                        urls.push(m[i]);
                    }
                }
                const githubEmbed = embeds.createEmbed();
                githubEmbed
                    .setAuthor("github", "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png")
                    .setTitle(`**Github Search** ${discord.getEmoji("raphi")}`)
                    .setURL(result[i].html_url)
                    .setDescription(`${discord.getEmoji("star")}_Name:_ **${result[i].name}**\n` +
                    `${discord.getEmoji("star")}_Author:_ **${result[i].owner.login}**\n` +
                    `${discord.getEmoji("star")}_Link:_ **${result[i].html_url}**\n` +
                    `${discord.getEmoji("star")}_Language:_ **${result[i].language}**\n` +
                    `${discord.getEmoji("star")}_Stargazers:_ **${result[i].stargazers_count}**\n` +
                    `${discord.getEmoji("star")}_Forks:_ **${result[i].forks_count}**\n` +
                    `${discord.getEmoji("star")}_Open Issues:_ **${result[i].open_issues}**\n` +
                    `${discord.getEmoji("star")}_Watchers:_ **${result[i].watchers_count}**\n` +
                    `${discord.getEmoji("star")}_Creation Date:_ **${Functions_1.Functions.formatDate(result[i].created_at)}**\n` +
                    `${discord.getEmoji("star")}_Updated:_ **${Functions_1.Functions.formatDate(result[i].updated_at)}**\n` +
                    `${discord.getEmoji("star")}_Description:_ ${result[i].description}\n`)
                    .setThumbnail(result[i].owner.avatar_url)
                    .setImage(urls[0]);
                githubArray.push(githubEmbed);
            }
            embeds.createReactionEmbed(githubArray);
        });
    }
}
exports.default = Github;
//# sourceMappingURL=github.js.map
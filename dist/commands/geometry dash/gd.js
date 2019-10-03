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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_64_1 = __importDefault(require("base-64"));
const gd = __importStar(require("gdprofiles"));
const GDClient = __importStar(require("geometry-dash-api"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class GeometryDash extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const star = discord.getEmoji("star");
            const GD = new GDClient({
                userName: "Tenpi",
                password: process.env.GD_PASSWORD
            });
            const { api } = GD;
            yield GD.login();
            if (args[1] === "user") {
                const nick = Functions_1.Functions.combineArgs(args, 2);
                const user = yield api.users.getByNick(nick);
                const gdUser = yield gd.search(nick);
                console.log(gdUser);
                const levelArray = [];
                for (const i in gdUser.lastLevels) {
                    levelArray.push(gdUser.lastLevels[i].name);
                }
                const gdEmbed = embeds.createEmbed();
                gdEmbed
                    .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
                    .setTitle(`**GD Profile** ${discord.getEmoji("raphi")}`)
                    .setURL(`https://gdprofiles.com/${user.nick}`)
                    .setDescription(`${star}${discord.getEmoji("gdStar")} **${user.stars}** ` +
                    `${discord.getEmoji("gdDiamond")} **${user.diamonds}** ` +
                    `${discord.getEmoji("gdCoin")} **${user.coins}** ` +
                    `${discord.getEmoji("gdUserCoin")} **${user.userCoins}** ` +
                    `${discord.getEmoji("gdDemon")} **${user.demons}** ` +
                    `${discord.getEmoji("gdCP")} **${user.creatorPoints}** \n` +
                    `${star}_Name:_ **${user.nick}**\n` +
                    `${star}_Rank:_ **#${user.top}**\n` +
                    `${star}_User ID:_ **${user.userID}**\n` +
                    `${star}_Account ID:_ **${user.accountID}**\n` +
                    `${star}_Account Type:_ **${user.rightsString}**\n` +
                    `${star}_Youtube:_ **${user.youtube}**\n` +
                    `${star}_Twitter:_ **${user.twitter}**\n` +
                    `${star}_Twitch:_ **${user.twitch}**\n` +
                    `${star}_Description:_ ${gdUser.desc ? gdUser.desc : "None"}\n` +
                    `${star}_Levels:_ ${levelArray.join("") ? levelArray.join(",     ") : "None"}\n`)
                    .setImage(`https://img.youtube.com/vi/${gdUser.video.embed.replace(/www.youtube.com\/embed\//g, "")}/maxresdefault.jpg`)
                    .setThumbnail(gdUser.img.player);
                message.channel.send(gdEmbed);
                return;
            }
            if (args[1] === "daily") {
                const level = yield api.levels.getDaily();
                const user = yield api.users.getById(level.creatorUserID);
                const gdEmbed = embeds.createEmbed();
                gdEmbed
                    .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
                    .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
                    .setDescription(`${star}_Name:_ **${level.name}**\n` +
                    `${star}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
                    `${star}_Level ID:_ **${level.levelID}**\n` +
                    `${star}_Song ID:_ **${level.songID}**\n` +
                    `${star}_Difficulty:_ **${level.diff}**\n` +
                    `${star}_Stars:_ **${level.stars}**\n` +
                    `${star}_Downloads:_ **${level.downloads}**\n` +
                    `${star}_Likes:_ **${level.likes}**\n` +
                    `${star}_Password:_ **${level.password ? level.password : "None"}**\n` +
                    `${star}_Description:_ ${base_64_1.default.decode(level.desc)}\n`);
                message.channel.send(gdEmbed);
                return;
            }
            if (args[1] === "weekly") {
                const level = yield api.levels.getWeekly();
                const user = yield api.users.getById(level.creatorUserID);
                const gdEmbed = embeds.createEmbed();
                gdEmbed
                    .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
                    .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
                    .setDescription(`${star}_Name:_ **${level.name}**\n` +
                    `${star}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
                    `${star}_Level ID:_ **${level.levelID}**\n` +
                    `${star}_Song ID:_ **${level.songID}**\n` +
                    `${star}_Difficulty:_ **${level.diff}**\n` +
                    `${star}_Stars:_ **${level.stars}**\n` +
                    `${star}_Downloads:_ **${level.downloads}**\n` +
                    `${star}_Likes:_ **${level.likes}**\n` +
                    `${star}_Password:_ **${level.password ? level.password : "None"}**\n` +
                    `${star}_Description:_ ${base_64_1.default.decode(level.desc)}\n`);
                message.channel.send(gdEmbed);
                return;
            }
            if (args[1] === "top") {
                const topArray = [];
                let users;
                if (args[2] === "100") {
                    users = yield api.tops.get({ type: "top", count: 100 });
                }
                else if (args[2] === "friends") {
                    users = yield api.tops.get({ type: "friends", count: 100 });
                }
                else if (args[2] === "global") {
                    users = yield api.tops.get({ type: "relative", count: 100 });
                }
                else if (args[2] === "creators") {
                    users = yield api.tops.get({ type: "creators", count: 100 });
                }
                for (let i = 0; i < users.length; i++) {
                    const topEmbed = embeds.createEmbed();
                    topEmbed
                        .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
                        .setTitle(`**GD Leaderboard** ${discord.getEmoji("raphi")}`)
                        .setDescription(`${star}_Rank:_ **${users[i].top}**\n` +
                        `${star}_User:_ **${users[i].nick}**\n` +
                        `${star}_User ID:_ **${users[i].userID}**\n` +
                        `${star}_Account ID:_ **${users[i].accountID}**\n`);
                    topArray.push(topEmbed);
                }
                embeds.createReactionEmbed(topArray);
                return;
            }
            const query = Functions_1.Functions.combineArgs(args, 1);
            if (query.match(/\d+/g)) {
                const level = yield api.levels.getById({ levelID: query.trim() });
                const user = yield api.users.getById(level.creatorUserID);
                console.log(level.creatorUserID);
                console.log(user);
                const gdLevel = yield gd.getLevelInfo(query.trim());
                console.log(level);
                console.log(gdLevel);
                return;
            }
            const result = yield api.levels.find({ query: query.trim() });
            const gdArray = [];
            for (let i = 0; i < result.levels.length; i++) {
                const level = yield api.levels.getById({ levelID: result.levels[i].levelID });
                const user = yield api.users.getById(result.levels[i].creatorUserID);
                const gdEmbed = embeds.createEmbed();
                gdEmbed
                    .setAuthor("geometry dash", "https://tchol.org/images/geometry-dash-png-7.png")
                    .setTitle(`**GD Level** ${discord.getEmoji("raphi")}`)
                    .setDescription(`${star}_Name:_ **${level.name}**\n` +
                    `${star}_Creator:_ **${user ? user.nick : "Not Found"}**\n` +
                    `${star}_Level ID:_ **${level.levelID}**\n` +
                    `${star}_Song ID:_ **${level.songID}**\n` +
                    `${star}_Difficulty:_ **${level.diff}**\n` +
                    `${star}_Stars:_ **${level.stars}**\n` +
                    `${star}_Downloads:_ **${level.downloads}**\n` +
                    `${star}_Likes:_ **${level.likes}**\n` +
                    `${star}_Password:_ **${level.password ? level.password : "None"}**\n` +
                    `${star}_Description:_ ${base_64_1.default.decode(level.desc)}\n`);
                gdArray.push(gdEmbed);
            }
            embeds.createReactionEmbed(gdArray);
        });
    }
}
exports.default = GeometryDash;
//# sourceMappingURL=gd.js.map
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const canvas_1 = require("canvas");
const discord_js_1 = require("discord.js");
const imageDataURI = __importStar(require("image-data-uri"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Points_1 = require("./../../structures/Points");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Rank extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const points = new Points_1.Points(discord);
            const canvas = canvas_1.createCanvas(200, 5);
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, 200, 5);
            const rawPointThreshold = yield sql.fetchColumn("points", "point threshold");
            const pointThreshold = Number(rawPointThreshold);
            const userScore = yield points.fetchScore(message);
            const userLevel = yield points.fetchLevel(message);
            const rankEmbed = embeds.createEmbed();
            if (userScore === (null || undefined)) {
                message.channel.send(rankEmbed
                    .setDescription("Could not find a score for you!"));
            }
            else {
                const percent = (100 / pointThreshold) * (userScore % pointThreshold);
                const width = (percent / 100) * 200;
                ctx.fillStyle = "#ff3d9b";
                ctx.fillRect(0, 0, width, 5);
                const dataUrl = canvas.toDataURL();
                yield imageDataURI.outputFile(dataUrl, `../assets/images/rankBar.jpg`);
                const attachment = new discord_js_1.MessageAttachment(`../assets/images/rankBar.jpg`);
                message.channel.send(rankEmbed
                    .setTitle(`**${message.author.username}'s Rank ${discord.getEmoji("kannaXD")}**`)
                    .setDescription(`${discord.getEmoji("star")}_Level_: **${userLevel}**\n` +
                    `${discord.getEmoji("star")}_Points_: **${userScore}**\n` +
                    `${discord.getEmoji("star")}_Progress_: ${userScore}/${(pointThreshold * userLevel) + pointThreshold}\n` +
                    `${discord.getEmoji("star")}**${percent.toFixed(1)}%** of the way there!`)
                    .attachFiles([attachment])
                    .setImage(`attachment://rankBar.jpg`)
                    .setThumbnail(message.author.displayAvatarURL));
            }
        });
    }
}
exports.default = Rank;
//# sourceMappingURL=rank.js.map
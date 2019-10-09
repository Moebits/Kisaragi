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
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Top extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const rawScoreList = yield sql.fetchColumn("points", "score list");
            const rawLevelList = yield sql.fetchColumn("points", "level list");
            const rawUserList = yield sql.fetchColumn("points", "user id list");
            const userList = rawUserList.map((num) => Number(num));
            const scoreList = rawScoreList.map((num) => Number(num));
            const levelList = rawLevelList.map((num) => Number(num));
            const objectArray = [];
            for (let i = 0; i < userList.length; i++) {
                const scoreObject = {
                    user: userList[i],
                    points: scoreList[i],
                    level: levelList[i]
                };
                objectArray.push(scoreObject);
            }
            objectArray.sort((a, b) => (a.points > b.points) ? -1 : 1);
            const iterations = Math.ceil(message.guild.memberCount / 10);
            const embedArray = [];
            loop1: for (let i = 0; i < iterations; i++) {
                const topEmbed = embeds.createEmbed();
                let description = "";
                for (let j = 0; j < 10; j++) {
                    const position = (i * 10) + j;
                    if (!objectArray[position])
                        break loop1;
                    description += `${discord.getEmoji("star")}_User:_ <@${objectArray[position].user}>\n` +
                        `${discord.getEmoji("star")}_Points:_ **${objectArray[position].points}**\n` +
                        `${discord.getEmoji("star")}_Level:_ **${objectArray[position].level}**\n`;
                }
                topEmbed
                    .setTitle(`**${message.guild.name}'s Leaderboard** ${discord.getEmoji("hanaDesires")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(description);
                embedArray.push(topEmbed);
            }
            embeds.createReactionEmbed(embedArray);
        });
    }
}
exports.default = Top;
//# sourceMappingURL=top.js.map
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
const Embeds_1 = require("./Embeds");
const Functions_1 = require("./Functions");
const SQLQuery_1 = require("./SQLQuery");
class Points {
    constructor(discord) {
        this.discord = discord;
        // Fetch Score
        this.fetchScore = (message) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const rawScoreList = yield sql.fetchColumn("points", "score list", false, false, true);
            const rawUserList = yield sql.fetchColumn("points", "user id list", false, false, true);
            const scoreList = rawScoreList.map((num) => Number(num));
            const userList = rawUserList.map((num) => Number(num));
            for (let i = 0; i < userList.length; i++) {
                if (userList[i] === Number(message.author.id)) {
                    const userScore = scoreList[i];
                    return userScore;
                }
            }
        });
        // Fetch Level
        this.fetchLevel = (message) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const rawLevelList = yield sql.fetchColumn("points", "level list", false, false, true);
            const rawUserList = yield sql.fetchColumn("points", "user id list", false, false, true);
            const levelList = rawLevelList.map((num) => Number(num));
            const userList = rawUserList.map((num) => Number(num));
            for (let i = 0; i < userList.length; i++) {
                if (userList[i] === Number(message.author.id)) {
                    const userLevel = levelList[i];
                    return userLevel;
                }
            }
        });
        // Calculate Score
        this.calcScore = (message) => __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            const sql = new SQLQuery_1.SQLQuery(message);
            const embeds = new Embeds_1.Embeds(this.discord, message);
            const rawScoreList = yield sql.fetchColumn("points", "score list", false, false, true);
            const rawLevelList = yield sql.fetchColumn("points", "level list", false, false, true);
            const rawPointRange = yield sql.fetchColumn("points", "point range", false, false, true);
            const rawPointThreshold = yield sql.fetchColumn("points", "point threshold", false, false, true);
            const rawUserList = yield sql.fetchColumn("points", "user id list", false, false, true);
            const levelUpMessage = yield sql.fetchColumn("points", "level message", false, false, true);
            const userList = rawUserList.map((num) => Number(num));
            if (!rawScoreList[0]) {
                const initList = [];
                for (let i = 0; i < userList.length; i++) {
                    initList[i] = 0;
                }
                yield sql.updateColumn("points", "score list", initList);
                yield sql.updateColumn("points", "level list", initList);
                return;
            }
            const scoreList = rawScoreList.map((num) => Number(num));
            const levelList = rawLevelList.map((num) => Number(num));
            const pointRange = rawPointRange.map((num) => Number(num));
            const pointThreshold = Number(rawPointThreshold);
            const userStr = levelUpMessage.join("").replace("user", `<@${message.author.id}>`);
            for (let i = 0; i < userList.length; i++) {
                if (userList[i] === Number(message.author.id)) {
                    const userScore = scoreList[i];
                    const userLevel = levelList[i];
                    if (userScore === undefined || userScore === null) {
                        scoreList[i] = 0;
                        levelList[i] = 0;
                        yield sql.updateColumn("points", "score list", scoreList);
                        yield sql.updateColumn("points", "score list", levelList);
                        return;
                    }
                    const newPoints = Math.floor(userScore + Functions_1.Functions.getRandomNum(pointRange[0], pointRange[1]));
                    const newLevel = Math.floor(userScore / pointThreshold);
                    const lvlStr = userStr.replace("newlevel", newLevel.toString());
                    if (newLevel > userLevel) {
                        levelList[i] = newLevel;
                        yield sql.updateColumn("points", "level list", levelList);
                        const channel = message.member.lastMessage.channel;
                        const levelEmbed = embeds.createEmbed();
                        levelEmbed
                            .setTitle(`**Level Up!** ${this.discord.getEmoji("vigneXD")}`)
                            .setDescription(lvlStr);
                        channel.send(levelEmbed);
                    }
                    scoreList[i] = newPoints;
                    yield sql.updateColumn("points", "score list", scoreList);
                    return;
                }
            }
        });
    }
}
exports.Points = Points;
//# sourceMappingURL=Points.js.map
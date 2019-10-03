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
const fs = __importStar(require("fs"));
const gifFrames = __importStar(require("gif-frames"));
const download = __importStar(require("image-downloader"));
const cv = __importStar(require("opencv4nodejs"));
const Functions_1 = require("./Functions");
const SQLQuery_1 = require("./SQLQuery");
const classifier = new cv.CascadeClassifier("../assets/cascades/animeface.xml");
class Detector {
    constructor(discord) {
        this.discord = discord;
        this.detectIgnore = (message) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const ignored = yield sql.fetchColumn("detection", "ignored");
            if (!ignored[0])
                return false;
            for (let i = 0; i < ignored[0].length; i++) {
                if (message.channel.id === ignored[0][i]) {
                    return true;
                }
            }
            return false;
        });
        this.detectAnime = (message) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const anime = yield sql.fetchColumn("detection", "pfp");
            if (yield this.detectIgnore(message))
                return;
            if (!anime)
                return;
            if (anime === "off")
                return;
            if (message.author.id === this.discord.user.id)
                return;
            if (message.attachments.size) {
                const urls = message.attachments.map((a) => a.url);
                for (let i = 0; i < urls.length; i++) {
                    yield download.image({ url: urls[i], dest: `../assets/detection/image${i}.jpg` });
                    const img = yield cv.imreadAsync(`../assets/detection/image${i}.jpg`);
                    const grayImg = yield img.bgrToGrayAsync();
                    const { numDetections } = yield classifier.detectMultiScaleAsync(grayImg);
                    if (!numDetections.join("")) {
                        const reply = yield message.reply("You can only post anime pictures!");
                        yield message.delete();
                        reply.delete({ timeout: 10000 });
                    }
                }
            }
        });
        this.swapRoles = (message, member, counter) => __awaiter(this, void 0, void 0, function* () {
            if (message.author.bot)
                return;
            const sql = new SQLQuery_1.SQLQuery(message);
            const pfp = yield sql.fetchColumn("detection", "pfp");
            if (!pfp || pfp === "off")
                return;
            if (!member)
                member = message.member;
            if (!member || member.user.bot || !member.user.displayAvatarURL())
                return;
            const weeb = yield sql.fetchColumn("detection", "weeb");
            const normie = yield sql.fetchColumn("detection", "normie");
            const weebRole = message.guild.roles.find((r) => r.id === weeb);
            const normieRole = message.guild.roles.find((r) => r.id === normie);
            if (member.user.displayAvatarURL().slice(-3) === "gif") {
                gifFrames({ url: member.user.displayAvatarURL(), frames: 1 }).then((frameData) => {
                    frameData[0].getImage().pipe(fs.createWriteStream("../assets/detection/user.jpg"));
                });
                yield Functions_1.Functions.timeout(1000);
            }
            else {
                yield download.image({ url: member.user.displayAvatarURL(), dest: `../assets/detection/user.jpg` });
            }
            const img = yield cv.imreadAsync(`../assets/detection/user.jpg`);
            const grayImg = yield img.bgrToGrayAsync();
            const { numDetections } = yield classifier.detectMultiScaleAsync(grayImg);
            if (!numDetections.join("")) {
                const found = member.roles.find((r) => r === normieRole);
                if (found) {
                    return;
                }
                else {
                    if (member.roles.find((r) => r === weebRole)) {
                        yield member.roles.remove(weebRole);
                    }
                    yield member.roles.add(normieRole);
                    if (counter) {
                        return false;
                    }
                    else {
                        yield message.reply(`You were swapped to the <@&${normie}> role because you do not have an anime profile picture!`);
                    }
                }
            }
            else {
                const found = member.roles.find((r) => r === weebRole);
                if (found) {
                    return;
                }
                else {
                    if (member.roles.find((r) => r === normieRole)) {
                        yield member.roles.remove(normieRole);
                    }
                    yield member.roles.add(weebRole);
                    if (counter) {
                        return true;
                    }
                    else {
                        yield message.reply(`You were swapped to the <@&${weeb}> role because you have an anime profile picture!`);
                    }
                }
            }
        });
    }
}
exports.Detector = Detector;
//# sourceMappingURL=Detector.js.map
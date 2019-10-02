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
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const svgCaptcha = __importStar(require("svg-captcha"));
const Embeds_1 = require("./Embeds");
class Captcha {
    constructor(discord, message) {
        this.discord = discord;
        this.message = message;
        this.embeds = new Embeds_1.Embeds(this.discord, this.message);
        this.createCaptcha = (type, color, difficulty) => __awaiter(this, void 0, void 0, function* () {
            const svg2img = require("svg2img");
            let tSize;
            let mMax;
            switch (difficulty.join("")) {
                case "easy":
                    tSize = 4;
                    mMax = 10;
                    break;
                case "medium":
                    tSize = 6;
                    mMax = 100;
                    break;
                case "hard":
                    tSize = 8;
                    mMax = 1000;
                    break;
                case "extreme":
                    tSize = 12;
                    mMax = 1000;
                default:
                    tSize = 4;
                    mMax = 10;
            }
            const captcha = (type.join() === "text") ?
                svgCaptcha.create({
                    size: tSize,
                    ignoreChars: "0oli",
                    noise: 1,
                    color: true,
                    background: color.join("")
                }) :
                svgCaptcha.createMathExpr({
                    mathMin: 1,
                    mathMax: mMax,
                    mathOperator: "+-",
                    color: true,
                    background: color.join("")
                });
            yield svg2img(captcha.data, function (error, buffer) {
                fs.writeFileSync("../assets/images/captcha.png", buffer);
            });
            const attachment = new discord_js_1.MessageAttachment("../assets/images/captcha.png");
            const captchaEmbed = this.embeds.createEmbed();
            captchaEmbed
                .setTitle(`Captcha ${this.discord.getEmoji("kannaAngry")}`)
                .attachFiles([attachment.url])
                .setImage(`attachment://captcha.png`)
                .setDescription(`${this.discord.getEmoji("star")}_Solve the captcha below. Type **cancel** to quit, or **skip** to get another captcha._`);
            return {
                captcha: captchaEmbed,
                text: captcha.text
            };
        });
    }
}
exports.Captcha = Captcha;
//# sourceMappingURL=Captcha.js.map
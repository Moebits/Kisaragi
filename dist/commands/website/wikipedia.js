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
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const wikijs_1 = __importDefault(require("wikijs"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const svg2img = require("svg2img");
class Wikipedia extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const wikipedia = wikijs_1.default();
            let title;
            if (!args[1]) {
                title = yield wikipedia.random(1);
            }
            else {
                const query = Functions_1.Functions.combineArgs(args, 1);
                const result = yield wikipedia.search(query, 1);
                title = result.results;
            }
            const page = yield wikipedia.page(title[0]);
            const summary = yield page.summary();
            const mainImg = yield page.mainImage();
            if (mainImg.slice(-3) === "svg") {
                yield svg2img(mainImg, function (error, buffer) {
                    fs_1.default.writeFileSync("../assets/images/wiki.png", buffer);
                });
                yield Functions_1.Functions.timeout(500);
                const attachment = new discord_js_1.MessageAttachment("../assets/images/wiki.png");
                const wikiEmbed = embeds.createEmbed();
                wikiEmbed
                    .setAuthor("wikipedia", "https://s3.amazonaws.com/static.graphemica.com/glyphs/i500s/000/010/228/original/0057-500x500.png")
                    .setTitle(`**Wikipedia Article** ${discord.getEmoji("raphi")}`)
                    .setURL(yield page.fullInfo().then((i) => i.fullUrl))
                    .attachFiles([attachment])
                    .setImage(`attachment://wiki.png`)
                    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiFv5c96eAMFjLxlSiE9F5GYKgzrMBPlUygB9vZzOUetVipzIe")
                    .setDescription(`${discord.getEmoji("star")}_Title:_ **${yield page.fullInfo().then((i) => i.title)}**\n` +
                    `${discord.getEmoji("star")}_Last Revision:_ **${Functions_1.Functions.formatDate(yield page.fullInfo().then((i) => i.touched))}**\n` +
                    `${discord.getEmoji("star")}_Summary:_ ${Functions_1.Functions.checkChar(summary, 1800, ".")}\n`);
                message.channel.send(wikiEmbed);
            }
            else {
                const wikiEmbed = embeds.createEmbed();
                wikiEmbed
                    .setAuthor("wikipedia", "https://s3.amazonaws.com/static.graphemica.com/glyphs/i500s/000/010/228/original/0057-500x500.png")
                    .setTitle(`**Wikipedia Article** ${discord.getEmoji("raphi")}`)
                    .setURL(yield page.fullInfo().then((i) => i.fullUrl))
                    .setImage(mainImg)
                    .setThumbnail("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiFv5c96eAMFjLxlSiE9F5GYKgzrMBPlUygB9vZzOUetVipzIe")
                    .setDescription(`${discord.getEmoji("star")}_Title:_ **${yield page.fullInfo().then((i) => i.title)}**\n` +
                    `${discord.getEmoji("star")}_Last Revision:_ **${Functions_1.Functions.formatDate(yield page.fullInfo().then((i) => i.touched))}**\n` +
                    `${discord.getEmoji("star")}_Summary:_ ${Functions_1.Functions.checkChar(summary, 1800, ".")}\n`);
                message.channel.send(wikiEmbed);
            }
        });
    }
}
exports.default = Wikipedia;
//# sourceMappingURL=wikipedia.js.map
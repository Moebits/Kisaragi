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
const google_images_1 = __importDefault(require("google-images"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class GoogleImageCommand extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const query = Functions_1.Functions.combineArgs(args, 1);
            const images = new google_images_1.default(process.env.GOOGLE_IMAGES_ID, process.env.GOOGLE_API_KEY);
            const result = yield images.search(query);
            const imagesArray = [];
            for (let i = 0; i < result.length; i++) {
                const imageEmbed = embeds.createEmbed();
                const size = Math.floor(result[i].size / 1024);
                imageEmbed
                    .setAuthor("google images", "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png")
                    .setURL(result[i].url)
                    .setTitle(`**Image Search** ${discord.getEmoji("raphi")}`)
                    .setDescription(`${discord.getEmoji("star")}_Website:_ ${result[i].url}\n` +
                    `${discord.getEmoji("star")}_Width:_ ${result[i].width} _Height:_ ${result[i].height}\n` +
                    `${discord.getEmoji("star")}_Filesize:_ ${size}KB\n` +
                    `${discord.getEmoji("star")}_Description:_ ${result[i].type}`)
                    .setImage(result[i].url);
                imagesArray.push(imageEmbed);
            }
            embeds.createReactionEmbed(imagesArray);
        });
    }
}
exports.default = GoogleImageCommand;
//# sourceMappingURL=images.js.map
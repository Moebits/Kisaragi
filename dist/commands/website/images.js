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
const GoogleImages = __importStar(require("google-images"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class GoogleImageCommand extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const query = Functions_1.Functions.combineArgs(args, 1);
            const images = new GoogleImages(process.env.GOOGLE_IMAGES_ID, process.env.GOOGLE_API_KEY);
            const result = yield images.search(query);
            const imagesArray = [];
            for (const i in result) {
                const imageEmbed = embeds.createEmbed();
                const size = Math.floor(result[i].size / 1024);
                imageEmbed
                    .setAuthor("google images", "https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png")
                    .setURL(result[i].parentPage)
                    .setTitle(`**Image Search** ${discord.getEmoji("raphi")}`)
                    .setDescription(`${discord.getEmoji("star")}_Website:_ ${result[i].parentPage}\n` +
                    `${discord.getEmoji("star")}_Width:_ ${result[i].width} _Height:_ ${result[i].height}\n` +
                    `${discord.getEmoji("star")}_Filesize:_ ${size}KB\n` +
                    `${discord.getEmoji("star")}_Description:_ ${result[i].description}`)
                    .setImage(result[i].url);
                imagesArray.push(imageEmbed);
            }
            embeds.createReactionEmbed(imagesArray);
        });
    }
}
exports.default = GoogleImageCommand;
//# sourceMappingURL=images.js.map
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
const kuroshiro_1 = __importDefault(require("kuroshiro"));
const kuroshiro_analyzer_kuromoji_1 = __importDefault(require("kuroshiro-analyzer-kuromoji"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
class Romaji extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const kuroshiro = new kuroshiro_1.default();
            yield kuroshiro.init(new kuroshiro_analyzer_kuromoji_1.default());
            const input = Functions_1.Functions.combineArgs(args, 1);
            const result = yield kuroshiro.convert(input, { mode: "spaced", to: "romaji" });
            const cleanResult = result.replace(/<\/?[^>]+(>|$)/g, "");
            const romajiEmbed = embeds.createEmbed();
            romajiEmbed
                .setAuthor("kuroshiro", "https://kuroshiro.org/kuroshiro.png")
                .setTitle(`**Romaji Conversion** ${discord.getEmoji("kannaSip")}`)
                .setDescription(`${discord.getEmoji("star")}${cleanResult}`);
            message.channel.send(romajiEmbed);
        });
    }
}
exports.default = Romaji;
//# sourceMappingURL=romaji.js.map
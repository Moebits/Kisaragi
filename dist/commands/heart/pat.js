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
const nekos_life_1 = __importDefault(require("nekos.life"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class Pat extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const neko = new nekos_life_1.default();
            const image = yield neko.sfw.pat();
            const patEmbed = embeds.createEmbed();
            patEmbed
                .setAuthor("nekos.life", "https://avatars2.githubusercontent.com/u/34457007?s=200&v=4")
                .setURL(image.url)
                .setTitle(`**Pat** ${discord.getEmoji("chinoSmug")}`)
                .setImage(image.url);
            message.channel.send(patEmbed);
        });
    }
}
exports.default = Pat;
//# sourceMappingURL=pat.js.map
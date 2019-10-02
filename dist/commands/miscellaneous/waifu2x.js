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
class Waifu2x extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            let imgUrl;
            if (!args[1]) {
                const messages = yield message.channel.messages.fetch({ limit: 10 });
                const imgUrls = messages.filter((m) => m.attachments.size);
                imgUrl = imgUrls.first().attachments.first().url;
            }
            else {
                imgUrl = args[1];
            }
            const deepai = require("deepai");
            deepai.setApiKey(process.env.DEEP_API_KEY);
            const response = yield deepai.callStandardApi("waifu2x", {
                image: imgUrl
            });
            const waifuEmbed = embeds.createEmbed();
            waifuEmbed
                .setAuthor("waifu2x", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9hWZ1ptE9IrNWOUqHzcf9OFD7RMMQEXeUwqpE3zCMB8PWD8Caeg")
                .setTitle(`**Waifu 2x Image Resizing** ${discord.getEmoji("gabYes")}`)
                .setURL(response.output_url)
                .setImage(response.output_url);
            message.channel.send(waifuEmbed);
        });
    }
}
exports.default = Waifu2x;
//# sourceMappingURL=waifu2x.js.map
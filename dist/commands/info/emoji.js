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
class Emoji extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const emojiEmbed = embeds.createEmbed();
            const emojiName = args[1];
            if (!emojiName.includes("<" || ">")) {
                const emojiFound = discord.emojis.find((emoji) => emoji.identifier === emojiName);
                if (emojiFound === null) {
                    message.channel.send(emojiEmbed
                        .setDescription("Could not find that emoji!"));
                    return;
                }
                message.channel.send(emojiEmbed
                    .setDescription(`**${emojiName} Emoji**`)
                    .setImage(`${emojiFound.url}`));
                return;
            }
            const snowflake = /\d+/;
            let emojiID = emojiName.substring(emojiName.search(snowflake));
            if (emojiID.includes(">")) {
                emojiID = emojiID.slice(0, -1);
            }
            if (typeof parseInt(emojiID, 10) === "number") {
                const emojiGet = discord.emojis.get(emojiID);
                message.channel.send(emojiEmbed
                    .setDescription(`**${emojiGet.name} Emoji**`)
                    .setImage(emojiGet.url));
                return;
            }
        });
    }
}
exports.default = Emoji;
//# sourceMappingURL=emoji.js.map
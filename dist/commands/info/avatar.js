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
class Avatar extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const avatarEmbed = embeds.createEmbed();
            if (!message.mentions.users.size) {
                if (message.author.displayAvatarURL().includes("gif" || "jpg")) {
                    yield message.channel.send(avatarEmbed
                        .setDescription(`**${message.author.username}'s Profile Picture**`)
                        .setImage(`${message.author.displayAvatarURL()}` + "?size=2048"));
                }
                else {
                    yield message.channel.send(avatarEmbed
                        .setDescription(`**${message.author.username}'s Profile Picture**`)
                        .setImage(message.author.displayAvatarURL()));
                }
            }
            for (const [, user] of message.mentions.users) {
                if (user.displayAvatarURL().includes("gif" || "jpg")) {
                    yield message.channel.send(avatarEmbed
                        .setDescription(`**${user.username}'s Profile Picture**`)
                        .setImage(`${user.displayAvatarURL}` + "?size=2048"));
                }
                else {
                    yield message.channel.send(avatarEmbed
                        .setDescription(`**${user.username}'s Profile Picture**`)
                        .setImage(user.displayAvatarURL));
                }
            }
        });
    }
}
exports.default = Avatar;
//# sourceMappingURL=avatar.js.map
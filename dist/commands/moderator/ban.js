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
const Permissions_1 = require("./../../structures/Permissions");
class Ban extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            if (yield perms.checkMod(message))
                return;
            const banEmbed = embeds.createEmbed();
            const reasonArray = [];
            const userArray = [];
            for (let i = 1; i < args.length; i++) {
                if (args[i].match(/\d+/g)) {
                    userArray.push(args[i].match(/\d+/g))[0];
                }
                else {
                    reasonArray.push(args[i]);
                }
            }
            const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!";
            const members = [];
            for (let i = 0; i < userArray.length; i++) {
                const member = message.guild.members.find((m) => m.id === userArray[i].join(""));
                if (member) {
                    members.push(`<@${member.id}>`);
                }
                else {
                    members.push(`<@${userArray[i]}>`);
                }
                banEmbed
                    .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                    .setDescription(`${discord.getEmoji("star")}_You were banned from ${message.guild.name} for reason:_ **${reason}**`);
                try {
                    const dm = yield member.createDM();
                    yield dm.send(banEmbed);
                }
                catch (err) {
                    console.log(err);
                }
                yield message.guild.members.ban(member ? member : userArray[i][0], { reason });
            }
            banEmbed
                .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_Successfully banned ${members.join(", ")} for reason:_ **${reason}**`);
            message.channel.send(banEmbed);
            return;
        });
    }
}
exports.default = Ban;
//# sourceMappingURL=ban.js.map
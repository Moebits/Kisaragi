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
class Kick extends Command_1.Command {
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
            const kickEmbed = embeds.createEmbed();
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
                members.push(`<@${member.id}>`);
                kickEmbed
                    .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                    .setTitle(`**You Were Kicked** ${discord.getEmoji("kannaFU")}`)
                    .setDescription(`${discord.getEmoji("star")}_You were kicked from ${message.guild.name} for reason:_ **${reason}**`);
                const dm = yield member.createDM();
                try {
                    yield dm.send(kickEmbed);
                }
                catch (err) {
                    console.log(err);
                }
                yield member.kick(reason);
            }
            kickEmbed
                .setAuthor("kick", "https://discordemoji.com/assets/emoji/4331_UmaruWave.png")
                .setTitle(`**Member Kicked** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_Successfully kicked ${members.join(", ")} for reason:_ **${reason}**`);
            message.channel.send(kickEmbed);
            return;
        });
    }
}
exports.default = Kick;
//# sourceMappingURL=kick.js.map
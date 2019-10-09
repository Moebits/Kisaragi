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
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Unmute extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            if (yield perms.checkMod(message))
                return;
            const muteEmbed = embeds.createEmbed();
            const mute = yield sql.fetchColumn("special roles", "mute role");
            if (!mute)
                return message.reply("You need to set a mute role first!");
            const reasonArray = [];
            const userArray = [];
            for (let i = 1; i < args.length; i++) {
                if (args[i].match(/\d+/g)) {
                    userArray.push(args[i].match(/\d+/g)[0]);
                }
                else {
                    reasonArray.push(args[i]);
                }
            }
            const reason = reasonArray.join("") ? reasonArray.join(" ") : "None provided!";
            const members = [];
            for (let i = 0; i < userArray.length; i++) {
                const member = message.guild.members.find((m) => m.id === userArray[i]);
                yield member.roles.remove(mute.join(""));
                members.push(`<@${member.id}>`);
                const dm = yield member.createDM();
                muteEmbed
                    .setAuthor("unmute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                    .setTitle(`**You Were Unmuted** ${discord.getEmoji("kannaFU")}`)
                    .setDescription(`${discord.getEmoji("star")}_You were unmuted in ${message.guild.name} for reason:_ **${reason}**`);
                yield dm.send(muteEmbed);
            }
            muteEmbed
                .setAuthor("unmute", "https://images.emojiterra.com/mozilla/512px/1f507.png")
                .setTitle(`**Member Unmuted** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_Successfully unmuted ${members.join(", ")} for reason:_ **${reason}**`);
            message.channel.send(muteEmbed);
            return;
        });
    }
}
exports.default = Unmute;
//# sourceMappingURL=unmute.js.map
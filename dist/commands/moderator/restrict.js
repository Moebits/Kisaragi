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
class Restrict extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const perms = new Permissions_1.Permissions(discord, message);
            if (yield perms.checkMod(message))
                return;
            const restrictEmbed = embeds.createEmbed();
            const restrict = yield sql.fetchColumn("special roles", "restricted role");
            if (!restrict)
                return message.reply("You need to set a restricted role first!");
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
                yield member.roles.add(restrict.join(""));
                members.push(`<@${member.id}>`);
                const dm = yield member.createDM();
                restrictEmbed
                    .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
                    .setTitle(`**You Were Restricted** ${discord.getEmoji("kannaFU")}`)
                    .setDescription(`${discord.getEmoji("star")}_You were restricted in ${message.guild.name} for reason:_ **${reason}**`);
                yield dm.send(restrictEmbed);
            }
            restrictEmbed
                .setAuthor("restrict", "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/mozilla/36/no-entry-sign_1f6ab.png")
                .setTitle(`**Member Restricted** ${discord.getEmoji("kannaFU")}`)
                .setDescription(`${discord.getEmoji("star")}_Successfully restricted ${members.join(", ")} for reason:_ **${reason}**`);
            message.channel.send(restrictEmbed);
            return;
        });
    }
}
exports.default = Restrict;
//# sourceMappingURL=restrict.js.map
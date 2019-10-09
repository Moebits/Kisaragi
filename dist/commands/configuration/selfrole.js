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
class Selfrole extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const embeds = new Embeds_1.Embeds(discord, message);
            if (yield perms.checkMod(message))
                return;
            let selfroles = yield sql.fetchColumn("special roles", "self roles");
            selfroles = JSON.parse(selfroles[0]);
            if (!selfroles[0])
                return;
            const roles = message.guild.roles.filter((r) => {
                for (let i = 0; i < selfroles.length; i++) {
                    const found = (selfroles[i] === r.id) ? true : false;
                    return found;
                }
                return false;
            }).map((r) => r);
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].name.toLowerCase().includes(args[1].toLowerCase())) {
                    const found = message.member.roles.find((r) => r.id === roles[i].id);
                    let description = "";
                    if (found) {
                        yield message.member.roles.remove(roles[i].id);
                        description = `${discord.getEmoji("star")}<@${message.author.id}>, you no longer have the <@&${roles[i].id}> role!`;
                    }
                    else {
                        yield message.member.roles.add(roles[i].id);
                        description = `${discord.getEmoji("star")}<@${message.author.id}>, you were given the <@&${roles[i].id}> role!`;
                    }
                    const selfEmbed = embeds.createEmbed();
                    selfEmbed
                        .setTitle(`**Self Role** ${discord.getEmoji("karenSugoi")}`)
                        .setDescription(description);
                    message.channel.send(selfEmbed);
                }
            }
        });
    }
}
exports.default = Selfrole;
//# sourceMappingURL=selfrole.js.map
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
const SQLQuery_1 = require("./SQLQuery");
class Permissions {
    constructor(discord, message) {
        this.discord = discord;
        this.message = message;
        this.sql = new SQLQuery_1.SQLQuery(this.message);
        // Check Mod
        this.checkMod = (msg, ignore) => __awaiter(this, void 0, void 0, function* () {
            if (msg.author.id === this.discord.user.id)
                return false;
            const mod = yield this.sql.fetchColumn("special roles", "mod role");
            if (!mod.join("")) {
                if (ignore)
                    return true;
                msg.reply("In order to use moderator commands, you must first " +
                    "configure the server's moderator role using the **mod** command!");
                return true;
            }
            else {
                const modRole = yield msg.member.roles.find((r) => r.id === mod.join("").trim());
                if (!modRole) {
                    if (ignore)
                        return true;
                    msg.reply("In order to use moderator commands, you must have " +
                        `the mod role which is currently set to <@&${mod.join("").trim()}>!`);
                    return true;
                }
            }
            return false;
        });
        // Check Admin
        this.checkAdmin = (msg, ignore) => __awaiter(this, void 0, void 0, function* () {
            if (msg.author.id === this.discord.user.id)
                return false;
            const admin = yield this.sql.fetchColumn("special roles", "admin role");
            if (!admin.join("")) {
                if (ignore)
                    return true;
                msg.reply("In order to use administrator commands, you must first " +
                    "configure the server's administrator role using the **mod** command!");
                return true;
            }
            else {
                const adminRole = yield msg.member.roles.find((r) => r.id === admin.join("").trim());
                if (!adminRole) {
                    if (ignore)
                        return true;
                    msg.reply("In order to use administrator commands, you must have " +
                        `the admin role which is currently set to <@&${admin.join("").trim()}>!`);
                    return true;
                }
            }
            return false;
        });
        // Check Bot Dev
        this.checkBotDev = (msg) => {
            if (msg.author.id === this.discord.user.id)
                return false;
            if (msg.author.id === process.env.OWNER_ID) {
                return false;
            }
            else {
                msg.reply("Only the bot developer can use bot developer commands");
                return true;
            }
        };
    }
}
exports.Permissions = Permissions;
//# sourceMappingURL=Permissions.js.map
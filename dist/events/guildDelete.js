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
const SQLQuery_1 = require("./../structures/SQLQuery");
class GuildDelete {
    constructor(discord) {
        this.run = (guild) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(yield this.discord.fetchFirstMessage(guild));
            sql.deleteGuild(guild.id);
        });
        this.discord = discord;
    }
}
exports.default = GuildDelete;
//# sourceMappingURL=guildDelete.js.map
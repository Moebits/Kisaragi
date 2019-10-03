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
const discord_js_1 = require("discord.js");
const Embeds_1 = require("./../structures/Embeds");
const SQLQuery_1 = require("./../structures/SQLQuery");
const active = new Set();
class MessageReactionAdd {
    constructor(discord) {
        this.discord = discord;
        this.run = (reaction) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(reaction.message);
            const embeds = new Embeds_1.Embeds(this.discord, reaction.message);
            if (reaction.message.author.id === this.discord.user.id) {
                if (active.has(reaction.message.id))
                    return;
                const newArray = yield sql.selectColumn("collectors", "message", true);
                let cached = false;
                for (let i = 0; i < newArray.length; i++) {
                    if (newArray[i][0] === reaction.message.id.toString()) {
                        cached = true;
                    }
                }
                if (cached) {
                    const messageID = yield sql.fetchColumn("collectors", "message", "message", reaction.message.id);
                    if (messageID) {
                        const cachedEmbeds = yield sql.fetchColumn("collectors", "embeds", "message", reaction.message.id);
                        const collapse = yield sql.fetchColumn("collectors", "collapse", "message", reaction.message.id);
                        const page = yield sql.fetchColumn("collectors", "page", "message", reaction.message.id);
                        const newEmbeds = [];
                        for (let i = 0; i < cachedEmbeds[0].length; i++) {
                            newEmbeds.push(new discord_js_1.MessageEmbed(JSON.parse(embeds[0][i])));
                        }
                        active.add(reaction.message.id);
                        yield embeds.editReactionCollector(reaction.message, reaction.emoji.name, newEmbeds, Boolean(collapse[0]), Number(page[0]));
                    }
                }
                else {
                    return;
                }
            }
        });
    }
}
exports.default = MessageReactionAdd;
//# sourceMappingURL=messageReactionAdd.js.map
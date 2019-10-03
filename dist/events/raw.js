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
const SQLQuery_1 = require("./../structures/SQLQuery");
const events = {
    MESSAGE_REACTION_ADD: "messageReactionAdd",
    MESSAGE_REACTION_REMOVE: "messageReactionRemove"
};
class Raw {
    constructor(discord) {
        this.discord = discord;
        this.run = (event) => __awaiter(this, void 0, void 0, function* () {
            if (!events.hasOwnProperty(event.t))
                return;
            const { d: data } = event;
            const user = this.discord.users.get(data.user_id);
            const channel = (this.discord.channels.get(data.channel_id) || (yield user.createDM()));
            const message = yield channel.messages.fetch(data.message_id);
            const sql = new SQLQuery_1.SQLQuery(message);
            if (channel.messages.has(data.message_id))
                return;
            yield sql.insertInto("ignore", "message", data.message_id);
            const emojiKey = data.emoji.id || data.emoji.name;
            let reaction = message.reactions.get(emojiKey);
            if (!reaction) {
                const emoji = new discord_js_1.GuildEmoji(this.discord, data.emoji, this.discord.guilds.get(data.guild_id));
                reaction = new discord_js_1.MessageReaction(this.discord, emoji, message);
            }
            this.discord.emit(events[event.t], reaction, user);
        });
    }
}
exports.default = Raw;
//# sourceMappingURL=raw.js.map
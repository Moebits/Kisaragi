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
class Block {
}
exports.Block = Block;
// Blocked Word
Block.block = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = new SQLQuery_1.SQLQuery(message);
    if (message.author.bot)
        return;
    const words = yield sql.fetchColumn("blocks", "blocked words");
    if (!words)
        return;
    words.forEach((w) => w.replace(/0/gi, "o").replace(/1/gi, "l").replace(/!/gi, "l").replace(/\*/gi, "u"));
    const match = yield sql.fetchColumn("blocks", "block match");
    if (match[0] === "exact") {
        if (words.some((w) => w.includes(message.content))) {
            const reply = yield message.reply("Your post was removed because it contained a blocked word.");
            yield message.delete();
            reply.delete({ timeout: 10000 });
        }
    }
    else {
        for (let i = 0; i < words.length; i++) {
            if (message.content.includes(words[i])) {
                const reply = yield message.reply("Your post was removed because it contained a blocked word.");
                yield message.delete();
                reply.delete({ timeout: 10000 });
            }
        }
    }
});
//# sourceMappingURL=Block.js.map
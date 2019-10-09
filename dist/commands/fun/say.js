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
const Functions_1 = require("./../../structures/Functions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Say extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const prefix = yield SQLQuery_1.SQLQuery.fetchPrefix(message);
            const rawText = Functions_1.Functions.combineArgs(args, 1);
            yield message.channel.send(Functions_1.Functions.checkChar(rawText, 2000, "."));
            if (message.content.startsWith(prefix[0]))
                yield message.delete();
            return;
        });
    }
}
exports.default = Say;
//# sourceMappingURL=say.js.map
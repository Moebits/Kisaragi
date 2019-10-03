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
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Test extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            console.log("here");
            const prefix = yield SQLQuery_1.SQLQuery.fetchPrefix(message);
            console.log(prefix);
            yield SQLQuery_1.SQLQuery.updatePrefix(message, "g!");
            const prefix2 = yield SQLQuery_1.SQLQuery.fetchPrefix(message);
            console.log(prefix2);
            yield SQLQuery_1.SQLQuery.updatePrefix(message, "=>");
            const prefix4 = yield SQLQuery_1.SQLQuery.fetchPrefix(message);
            console.log(prefix4);
        });
    }
}
exports.default = Test;
//# sourceMappingURL=test.js.map
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const kaomoji = __importStar(require("kaomojilib"));
const Command_1 = require("../../structures/Command");
const Functions_1 = require("./../../structures/Functions");
class Kaomoji extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const lib = [];
            const keys = Object.keys(kaomoji.library);
            for (let i = 0, n = keys.length; i < n; i++) {
                const key = keys[i];
                lib[i] = kaomoji.library[key];
            }
            if (!args[1]) {
                const random = Math.floor(Math.random() * lib.length);
                message.channel.send(lib[random].icon);
                return;
            }
            const query = Functions_1.Functions.combineArgs(args, 1);
            for (const i in lib) {
                for (const j in lib[i].keywords) {
                    if (query.toLowerCase().trim() === lib[i].keywords[j].toLowerCase()) {
                        message.channel.send(lib[i].icon);
                        return;
                    }
                }
            }
            message.channel.send("No kaomoji were found.");
        });
    }
}
exports.default = Kaomoji;
//# sourceMappingURL=kaomoji.js.map
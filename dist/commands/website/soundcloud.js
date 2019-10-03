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
const SoundCloud = __importStar(require("soundcloud-api-client"));
const Command_1 = require("../../structures/Command");
const Functions_1 = require("../../structures/Functions");
class Soundcloud extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const clientId = "9aB60VZycIERY07OUTVBL5GeErnTA0E4";
            const soundcloud = new SoundCloud({ clientId });
            const query = Functions_1.Functions.combineArgs(args, 1);
            const tracks = yield soundcloud.get("/tracks", { query });
            console.log(tracks);
        });
    }
}
exports.default = Soundcloud;
//# sourceMappingURL=soundcloud.js.map
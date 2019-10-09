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
const blacklist = __importStar(require("../../blacklist.json"));
const Command_1 = require("../../structures/Command");
const Images_js_1 = require("../../structures/Images.js");
const Functions_1 = require("./../../structures/Functions");
const nhentai = require("nhentai-js");
class $nHentai extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.nhentaiRandom = (filter) => __awaiter(this, void 0, void 0, function* () {
            let random = "0";
            while (!(yield nhentai.exists(random))) {
                random = Math.floor(Math.random() * 1000000).toString();
            }
            const doujin = yield nhentai.getDoujin(random);
            if (filter) {
                for (const i in doujin.details.tags) {
                    for (let j = 0; j < blacklist.nhentai.length; j++) {
                        if (doujin.details.tags[i] === blacklist.nhentai[j]) {
                            yield this.nhentaiRandom(true);
                        }
                    }
                }
            }
            return doujin;
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const images = new Images_js_1.Images(discord, message);
            if (!args[1]) {
                const doujin = yield this.nhentaiRandom(false);
                images.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g));
                return;
            }
            else {
                if (args[1].toLowerCase() === "random") {
                    const doujin = yield this.nhentaiRandom(true);
                    images.getNhentaiDoujin(doujin, doujin.link.match(/\d+/g));
                    return;
                }
                const tag = Functions_1.Functions.combineArgs(args, 1);
                if (tag.match(/\d+/g) !== null) {
                    const doujin = yield nhentai.getDoujin(tag.match(/\d+/g).toString());
                    images.getNhentaiDoujin(doujin, tag.match(/\d+/g).toString());
                }
                else {
                    const result = yield nhentai.search(tag);
                    const index = Math.floor(Math.random() * 10);
                    const book = result.results[index];
                    const doujin = yield nhentai.getDoujin(book.bookId);
                    images.getNhentaiDoujin(doujin, book.bookId);
                }
            }
        });
    }
}
exports.default = $nHentai;
//# sourceMappingURL=nhentai.js.map
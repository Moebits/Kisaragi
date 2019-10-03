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
const PixivApi_1 = require("./../../structures/PixivApi");
class Pixiv extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const pixivApi = new PixivApi_1.PixivApi(discord, message);
            const tags = Functions_1.Functions.combineArgs(args, 1);
            const refreshToken = yield pixivApi.pixivLogin();
            if (!args[1]) {
                yield pixivApi.getRandomPixivImage(refreshToken);
                return;
            }
            if (tags.match(/\d+/g) !== null) {
                yield pixivApi.getPixivImageID(refreshToken, tags.match(/\d+/g));
                return;
            }
            if (args[1].toLowerCase() === "r18") {
                if (args[2].toLowerCase() === "en") {
                    const r18Tags = Functions_1.Functions.combineArgs(args, 3);
                    yield pixivApi.getPixivImage(refreshToken, r18Tags, true, true);
                    return;
                }
                else {
                    const r18Tags = Functions_1.Functions.combineArgs(args, 2);
                    yield pixivApi.getPixivImage(refreshToken, r18Tags, true);
                    return;
                }
            }
            if (args[1].toLowerCase() === "en") {
                const enTags = Functions_1.Functions.combineArgs(args, 2);
                yield pixivApi.getPixivImage(refreshToken, enTags, false, true);
                return;
            }
            if (args[1].toLowerCase() === "popular") {
                if (args[2].toLowerCase() === "r18") {
                    yield pixivApi.getPopularPixivR18Image(refreshToken);
                    return;
                }
                yield pixivApi.getPopularPixivImage(refreshToken);
                return;
            }
            yield pixivApi.getPixivImage(refreshToken, tags);
        });
    }
}
exports.default = Pixiv;
//# sourceMappingURL=pixiv.js.map
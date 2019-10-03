"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const letters = __importStar(require("../letters.json"));
const Functions_1 = require("./Functions");
class Letters {
    constructor(discord) {
        this.discord = discord;
        // Parse Letters
        this.letters = (text) => {
            const fullText = [];
            for (let i = 0; i < text.length; i++) {
                fullText.push(this.getLetter(text[i]));
            }
            const fullString = fullText.join("");
            return Functions_1.Functions.checkChar(fullString, 1999, "<");
        };
        // Parse Emoji Letters
        this.getLetter = (letter) => {
            if (letter === " ")
                return "     ";
            if (letter === letter.toUpperCase()) {
                for (let i = 0; i < letters.letters.length; i++) {
                    if (letters.letters[i].name === `${letter}U`) {
                        const found = this.discord.emojis.find((emoji) => emoji.id === letters.letters[i].id);
                        return `<:${found.identifier}>`;
                    }
                }
                return letter;
            }
            if (letter === letter.toLowerCase()) {
                for (let i = 0; i < letters.letters.length; i++) {
                    if (letters.letters[i].name === `${letter}l`) {
                        const found = this.discord.emojis.find((emoji) => emoji.id === letters.letters[i].id);
                        return `<:${found.identifier}>`;
                    }
                }
                return letter;
            }
            if (typeof Number(letter) === "number") {
                for (let i = 0; i < letters.letters.length; i++) {
                    if (letters.letters[i].name === `${letter}n`) {
                        const found = this.discord.emojis.find((emoji) => emoji.id === letters.letters[i].id);
                        return `<:${found.identifier}>`;
                    }
                }
                return letter;
            }
        };
    }
}
exports.Letters = Letters;
//# sourceMappingURL=Letters.js.map
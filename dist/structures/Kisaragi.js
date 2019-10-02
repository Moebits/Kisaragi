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
const discord_js_1 = require("discord.js");
const config = __importStar(require("../config.json"));
const Embeds_1 = require("./Embeds");
class Kisaragi extends discord_js_1.Client {
    constructor(options, message) {
        super(options);
        this.message = message;
        this.embeds = new Embeds_1.Embeds(this, this.message);
        // Get Emoji
        this.getEmoji = (name) => {
            for (let i = 0; i < config.emojis.length; i++) {
                if (name === config.emojis[i].name) {
                    return this.emojis.find((emoji) => emoji.id === config.emojis[i].id);
                }
            }
            return `<:ConfusedAnime:579870079311937557>`;
        };
        // Fetch Message
        this.fetchMessage = (msg, messageID) => __awaiter(this, void 0, void 0, function* () {
            const channels = msg.guild.channels.map((c) => { if (c.type === "text")
                return c; });
            const msgArray = [];
            for (let i = 0; i < channels.length; i++) {
                const found = yield channels[i].messages.fetch({ limit: 1, around: messageID });
                if (found)
                    msgArray.push(found.first());
            }
            const msgFound = msgArray.find((m) => m.id === messageID);
            return msgFound;
        });
        // Fetch First Message in a Guild
        this.fetchFirstMessage = (guild) => __awaiter(this, void 0, void 0, function* () {
            const channels = guild.channels.filter((c) => c.type === "text");
            const channel = channels.first();
            const lastMsg = yield channel.messages.fetch({ limit: 1 }).then((c) => c.first());
            return lastMsg;
        });
        // Check for Bot Mention
        this.checkBotMention = (message) => {
            if (message.author.id === this.user.id)
                return false;
            if (message.content.startsWith(this.user.id))
                return true;
        };
        // Errors
        this.cmdError = (error) => {
            console.log(error);
            const messageErrorEmbed = this.embeds.createEmbed();
            messageErrorEmbed
                .setTitle(`**Command Error** ${this.getEmoji("maikaWut")}`)
                .setDescription(`There was an error executing this command:\n` +
                `**${error.name}: ${error.message}**\n` + `Please report this through the following links:\n` +
                `[Official Server](https://gg/77yGmWM), [Github Repo](https://github.com/Tenpi/Gab)`);
            return messageErrorEmbed;
        };
    }
}
exports.Kisaragi = Kisaragi;
//# sourceMappingURL=Kisaragi.js.map
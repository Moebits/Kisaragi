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
const Embeds_1 = require("./../../structures/Embeds");
const Functions_1 = require("./../../structures/Functions");
const Permissions_1 = require("./../../structures/Permissions");
class Delete extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.bulkDelete = (num, message, userID, search, args, query) => __awaiter(this, void 0, void 0, function* () {
            const msgArray = [];
            if (userID) {
                const messages = yield message.channel.messages.fetch({ limit: num }).then((c) => c.map((m) => m));
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].author.id === args[2].match(/\d+/g).join("")) {
                        msgArray.push(messages[i].id);
                    }
                }
                yield message.channel.bulkDelete(msgArray, true);
            }
            else if (search) {
                const messages = yield message.channel.messages.fetch({ limit: num }).then((c) => c.map((m) => m));
                for (let i = 0; i < messages.length; i++) {
                    if (messages[i].embeds[0] ?
                        (messages[i].embeds[0].description ? messages[i].embeds[0].description.toLowerCase().includes(query.trim().toLowerCase()) : false)
                        : messages[i].content.toLowerCase().includes(query.trim().toLowerCase())) {
                        msgArray.push(messages[i].id);
                    }
                }
                yield message.channel.bulkDelete(msgArray, true);
            }
            else {
                yield message.channel.bulkDelete(num, true);
            }
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            if (yield perms.checkMod(message))
                return;
            const delEmbed = embeds.createEmbed();
            const num = Number(args[1]) + 2;
            let userID = false;
            let search = false;
            let query;
            if (args[2]) {
                if (args[2].match(/\d+/g)) {
                    userID = true;
                }
                else {
                    query = Functions_1.Functions.combineArgs(args, 2);
                    search = true;
                }
            }
            if (!num) {
                delEmbed
                    .setDescription("Correct usage is =>del (number).");
                message.channel.send(delEmbed);
                return;
            }
            if (num < 2 || num > 1002) {
                delEmbed
                    .setDescription("You must type a number between 0 and 1000!");
                message.channel.send(delEmbed);
                return;
            }
            if (num <= 100) {
                yield this.bulkDelete(num, message, userID, search, args, query);
            }
            else {
                const iterations = Math.floor(num / 100);
                for (let i = 0; i <= iterations; i++) {
                    yield this.bulkDelete(100, message, userID, search, args, query);
                }
                yield this.bulkDelete(num % 100, message, userID, search, args, query);
            }
            if (userID) {
                try {
                    yield message.delete();
                }
                catch (err) {
                    console.log(err);
                }
                delEmbed
                    .setDescription(`Deleted the last **${args[1]}** messages by <@${args[2].match(/\d+/g).join("")}>!`);
            }
            else if (search) {
                delEmbed
                    .setDescription(`Deleted the last **${args[1]}** messages containing **${query}**!`);
            }
            else {
                delEmbed
                    .setDescription(`Deleted **${args[1]}** messages in this channel!`);
            }
            const msg = yield message.channel.send(delEmbed);
            msg.delete({ timeout: 5000 });
            return;
        });
    }
}
exports.default = Delete;
//# sourceMappingURL=delete.js.map
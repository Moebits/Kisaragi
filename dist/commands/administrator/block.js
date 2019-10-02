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
const Embeds_1 = require("../../structures/Embeds");
const SQLQuery_1 = require("../../structures/SQLQuery");
const Functions_1 = require("./../../structures/Functions");
const Permissions_1 = require("./../../structures/Permissions");
class Block extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const star = discord.getEmoji("star");
            if (yield perms.checkAdmin(message))
                return;
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                blockPrompt(message);
                return;
            }
            const blockedWords = yield sql.fetchColumn("blocks", "blocked words");
            const match = yield sql.fetchColumn("blocks", "block match");
            const toggle = yield sql.fetchColumn("blocks", "block toggle");
            let wordList = "";
            if (blockedWords[0]) {
                for (let i = 0; i < blockedWords[0].length; i++) {
                    wordList += `**${i + 1} - ${blockedWords[0][i]}**\n`;
                }
            }
            else {
                wordList = "None";
            }
            const blockEmbed = embeds.createEmbed();
            blockEmbed
                .setTitle(`**Blocked Words** ${discord.getEmoji("gabuChrist")}`)
                .setThumbnail(message.guild.iconURL())
                .setDescription("Add or remove blocked words.\n" +
                "\n" +
                "**Exact** = Only matches the exact word.\n" +
                "**Partial** = Also matches if the word is partially in another word.\n" +
                "\n" +
                "__Word List__\n" +
                wordList + "\n" +
                "\n" +
                "__Current Settings__" +
                `${star}_Filtering is **${toggle[0]}**._\n` +
                `${star}_Matching algorithm set to **${match[0]}**._\n` +
                "\n" +
                "__Edit Settings__" +
                "\n" +
                `${star}_**Type any words**, separated by a space, to add blocked words._\n` +
                `${star}_Type **enable** or **disable** to enable/disable filtering._\n` +
                `${star}_Type **exact** or **partial** to set the matching algorithm._\n` +
                `${star}_Type **delete (word number)** to delete a word._\n` +
                `${star}_Type **reset** to delete all words._\n` +
                `${star}_Type **cancel** to exit._\n`);
            message.channel.send(blockEmbed);
            function blockPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    let words = yield sql.fetchColumn("blocks", "blocked words");
                    let [setOn, setOff, setExact, setPartial, setWord] = [];
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("blocks", "blocked words", null);
                        responseEmbed
                            .setDescription(`${star}All blocked words were deleted!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase().includes("delete")) {
                        const num = Number(msg.content.replace(/delete/gi, "").replace(/\s+/g, ""));
                        if (num) {
                            if (words[0]) {
                                words[num - 1] = "";
                                words = words.filter(Boolean);
                                yield sql.updateColumn("blocks", "blocked words", words);
                                responseEmbed
                                    .setDescription(`${star}Setting ${num} was deleted!`);
                                msg.channel.send(responseEmbed);
                                return;
                            }
                        }
                        else {
                            responseEmbed
                                .setDescription(`${star}Setting not found!`);
                            msg.channel.send(responseEmbed);
                            return;
                        }
                    }
                    const newMsg = msg.content.replace(/enable/gi, "").replace(/disable/gi, "").replace(/exact/gi, "").replace(/partial/gi, "");
                    if (msg.content.match(/enable/gi))
                        setOn = true;
                    if (msg.content.match(/disable/gi))
                        setOff = true;
                    if (msg.content.match(/exact/gi))
                        setExact = true;
                    if (msg.content.match(/partial/gi))
                        setPartial = true;
                    if (newMsg)
                        setWord = true;
                    let wordArray = newMsg.split(" ");
                    if (setOn && setOff) {
                        responseEmbed
                            .setDescription(`${star}You cannot disable/enable at the same time.`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (setExact && setPartial) {
                        responseEmbed
                            .setDescription(`${star}You can only choose one matching algorithm.`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    let description = "";
                    if (words[0]) {
                        for (let i = 0; i < words[0].length; i++) {
                            for (let j = 0; j < wordArray.length; j++) {
                                if (words[0][i] === wordArray[j]) {
                                    description += `${star}**${wordArray[j]}** is already blocked!`;
                                    wordArray[j] = "";
                                    wordArray = wordArray.filter(Boolean);
                                }
                            }
                        }
                    }
                    if (setWord) {
                        setOn = true;
                        yield sql.updateColumn("blocks", "blocked words", wordArray);
                        description += `${star}Added **${wordArray.join(", ")}**!\n`;
                    }
                    if (setExact) {
                        yield sql.updateColumn("blocks", "block match", "exact");
                        description += `${star}Matching algorithm set to **exact**!\n`;
                    }
                    if (setPartial) {
                        yield sql.updateColumn("blocks", "block match", "partial");
                        description += `${star}Matching algorithm set to **partial**!\n`;
                    }
                    if (setOn) {
                        yield sql.updateColumn("blocks", "block toggle", "on");
                        description += `${star}Filtering is **enabled**!\n`;
                    }
                    if (setOff) {
                        yield sql.updateColumn("blocks", "block toggle", "off");
                        description += `${star}Filtering is **disabled**!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(blockPrompt);
        });
    }
}
exports.default = Block;
//# sourceMappingURL=block.js.map
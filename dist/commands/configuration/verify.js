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
const Captcha_1 = require("./../../structures/Captcha");
const Embeds_1 = require("./../../structures/Embeds");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Verify extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const captchaClass = new Captcha_1.Captcha(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const vToggle = yield sql.fetchColumn("captcha", "verify toggle");
            if (vToggle.join("") === "off")
                return;
            const vRole = yield sql.fetchColumn("captcha", "verify role");
            const cType = yield sql.fetchColumn("captcha", "captcha type");
            const color = yield sql.fetchColumn("captcha", "captcha color");
            const difficulty = yield sql.fetchColumn("captcha", "difficulty");
            const role = message.guild.roles.find((r) => r.id === vRole.join(""));
            if (!role) {
                const vErrorEmbed = embeds.createEmbed();
                vErrorEmbed.setDescription("Could not find the verify role!");
                return vErrorEmbed;
            }
            const type = cType;
            const { captcha, text } = yield captchaClass.createCaptcha(type, color, difficulty);
            const filter = (response) => {
                return (response.author === message.author);
            };
            function sendCaptcha(cap, txt) {
                message.channel.send(cap).then(() => {
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] })
                        .then((collected) => __awaiter(this, void 0, void 0, function* () {
                        const msg = collected.first();
                        const responseEmbed = embeds.createEmbed();
                        responseEmbed
                            .setTitle(`Captcha ${discord.getEmoji("kannaAngry")}`);
                        if (msg.content.trim() === "cancel") {
                            responseEmbed
                                .setDescription("Quit the captcha prompts.");
                            return msg.channel.send(responseEmbed);
                        }
                        else if (msg.content.trim() === "skip") {
                            message.reply("Skipped this captcha!");
                            const result = yield captchaClass.createCaptcha(type, color, difficulty);
                            return sendCaptcha(result.captcha, result.text);
                        }
                        else if (msg.content.trim() === txt) {
                            if (msg.member.roles.has(role.id)) {
                                yield msg.member.roles.remove(role);
                                yield msg.member.roles.add(role, "Successfully solved the captcha");
                            }
                            else {
                                yield msg.member.roles.add(role, "Successfully solved the captcha");
                            }
                            responseEmbed
                                .setDescription(`${discord.getEmoji("pinkCheck")} **${msg.member.displayName}** was verified!`);
                            return msg.channel.send(responseEmbed);
                        }
                        else {
                            msg.reply("Wrong answer! Please try again.");
                            const result = yield captchaClass.createCaptcha(type, color, difficulty);
                            return sendCaptcha(result.captcha, result.text);
                        }
                    }))
                        .catch((collected) => {
                        console.log(collected);
                        message.channel.send("Quit the captcha because the time has run out.");
                    });
                });
            }
            sendCaptcha(captcha, text);
        });
    }
}
exports.default = Verify;
//# sourceMappingURL=verify.js.map
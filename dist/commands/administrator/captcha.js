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
const Functions_1 = require("./../../structures/Functions");
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class CaptchaCmd extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const captchaClass = new Captcha_1.Captcha(discord, message);
            const star = discord.getEmoji("star");
            if (yield perms.checkAdmin(message))
                return;
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                captchaPrompt(message);
                return;
            }
            const vToggle = yield sql.fetchColumn("captcha", "verify toggle");
            const vRole = yield sql.fetchColumn("captcha", "verify role");
            const cType = yield sql.fetchColumn("captcha", "captcha type");
            const color = yield sql.fetchColumn("captcha", "captcha color");
            const difficulty = yield sql.fetchColumn("captcha", "difficulty");
            const captchaEmbed = embeds.createEmbed();
            const { captcha } = yield captchaClass.createCaptcha(cType, color, difficulty);
            console.log(captcha.files);
            captchaEmbed
                .setTitle(`**Captcha Verification** ${discord.getEmoji("kannaAngry")}`)
                .attachFiles(captcha.files)
                .setImage(captcha.image.url)
                .setThumbnail(message.guild.iconURL())
                .setDescription("Configure settings for captcha verification. In order for this to function, you should create a role for verified members " +
                "and deny the @everyone role reading permissions in all your guild channels, with the exception of the rules channel and the verify channel. Use **verify** to send a captcha.\n" +
                "\n" +
                "**Verify Role** = The role given to members who solve the captcha.\n" +
                "**Captcha Type** = Either text or math.\n" +
                "**Captcha Difficulty** = Either easy, medium, hard, or extreme.\n" +
                "\n" +
                "__Current Settings:__\n" +
                `${star}_Verify Role:_ **${vRole.join("") ? "<@&" + vRole.join("") + ">" : "None"}**\n` +
                `${star}_Verify Toggle:_ **${vToggle.join("")}**\n` +
                `${star}_Captcha Type:_ **${cType.join("")}**\n` +
                `${star}_Captcha Difficulty:_ **${difficulty.join("")}**\n` +
                `${star}_Background Color:_ **${color.join("")}**\n` +
                "\n" +
                "__Edit Settings:__\n" +
                `${star}_Type **enable** or **disable** to enable or disable verification._\n` +
                `${star}_**Mention a role** or type the **role id** to set the verified role._\n` +
                `${star}_Type **text** or **math** to set the captcha type._\n` +
                `${star}_Type **easy**, **medium**, **hard**, or **extreme** to set the difficulty._\n` +
                `${star}_Type a **hex color** to set the background color._\n` +
                `${star}_**You can type multiple options** to enable all at once._\n` +
                `${star}_Type **reset** to reset all settings._\n` +
                `${star}_Type **cancel** to exit._\n`);
            message.channel.send(captchaEmbed);
            function captchaPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Captcha Verification** ${discord.getEmoji("kannaAngry")}`);
                    let [setOn, setOff, setRole, setText, setMath, setColor, setEasy, setMedium, setHard, setExtreme] = [];
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("captcha", "verify toggle", "off");
                        yield sql.updateColumn("captcha", "verify role", null);
                        yield sql.updateColumn("captcha", "captcha type", "text");
                        yield sql.updateColumn("captcha", "captcha color", "#ffffff");
                        yield sql.updateColumn("captcha", "difficulty", "medium");
                        responseEmbed
                            .setDescription(`${star}All settings were reset!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    const newRole = msg.content.match(/\d+/g);
                    const newColor = msg.content.match(/(\s|^)#[0-9a-f]{3,6}/ig);
                    if (msg.content.match(/enable/gi))
                        setOn = true;
                    if (msg.content.match(/disable/gi))
                        setOff = true;
                    if (msg.content.match(/text/gi))
                        setText = true;
                    if (msg.content.match(/math/gi))
                        setMath = true;
                    if (msg.content.match(/easy/gi))
                        setEasy = true;
                    if (msg.content.match(/medium/gi))
                        setMedium = true;
                    if (msg.content.match(/hard/gi))
                        setHard = true;
                    if (msg.content.match(/extreme/gi))
                        setExtreme = true;
                    if (newRole)
                        setRole = true;
                    if (newColor)
                        setColor = true;
                    if (setOn && setOff) {
                        responseEmbed
                            .setDescription(`${star}You cannot disable/enable at the same time.`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (setText && setMath) {
                        responseEmbed
                            .setDescription(`${star}You cannot set both captcha types at the same time.`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (setOn && !setRole) {
                        responseEmbed
                            .setDescription(`${star}In order to enable verification, you must set the verify role.`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    let description = "";
                    if (setExtreme || setHard || setMedium || setEasy) {
                        const diff = setExtreme ? setExtreme : (setHard ? setHard : (setMedium ? setMedium : setEasy));
                        yield sql.updateColumn("captcha", "verify toggle", diff);
                        description += `${star}Captcha difficulty set to **${diff}**!\n`;
                    }
                    if (setOn) {
                        yield sql.updateColumn("captcha", "verify toggle", "on");
                        description += `${star}Captcha verification is **on**!\n`;
                    }
                    if (setOff) {
                        yield sql.updateColumn("captcha", "verify toggle", "off");
                        description += `${star}Captcha verification is **off**!\n`;
                    }
                    if (setText) {
                        yield sql.updateColumn("captcha", "captcha type", "text");
                        description += `${star}Captcha type set to **text**!\n`;
                    }
                    if (setMath) {
                        yield sql.updateColumn("captcha", "captcha type", "math");
                        description += `${star}Captcha type set to **math**!\n`;
                    }
                    if (setRole) {
                        yield sql.updateColumn("captcha", "verify role", newRole.join(""));
                        description += `${star}Verify role set to <@&${newRole}>!\n`;
                    }
                    if (setColor) {
                        yield sql.updateColumn("captcha", "captcha color", newColor.join(""));
                        description += `${star}Background color set to ${newColor.join("")}\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(captchaPrompt);
        });
    }
}
exports.default = CaptchaCmd;
//# sourceMappingURL=captcha.js.map
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
const discord_js_1 = require("discord.js");
const CommandFunctions_1 = require("../structures/CommandFunctions");
const Cooldown_js_1 = require("../structures/Cooldown.js");
const Block_1 = require("./../structures/Block");
const Detector_1 = require("./../structures/Detector");
const Haiku_1 = require("./../structures/Haiku");
const Letters_1 = require("./../structures/Letters");
const Link_1 = require("./../structures/Link");
const Points_1 = require("./../structures/Points");
const SQLQuery_1 = require("./../structures/SQLQuery");
class MessageEvent {
    constructor(discord) {
        this.discord = discord;
        this.cooldowns = new discord_js_1.Collection();
        this.responseTextCool = new Set();
        this.responseImageCool = new Set();
        this.run = (message) => __awaiter(this, void 0, void 0, function* () {
            const letters = new Letters_1.Letters(this.discord);
            const points = new Points_1.Points(this.discord);
            const haiku = new Haiku_1.Haiku(this.discord);
            const cmdFunctions = new CommandFunctions_1.CommandFunctions(this.discord);
            const detect = new Detector_1.Detector(this.discord);
            const links = new Link_1.Link(this.discord);
            /*let guildIDs = [
              "594616328351121419"
            ]
            for (let i in guildIDs) {
              let guild = discord.guilds.find(g => guildIDs[i] === g.id.toString())
              await guild.delete()
            }*/
            const prefix = yield SQLQuery_1.SQLQuery.fetchPrefix(message);
            /*let letterNames = [
              ""
            ]
        
            discord.generateEmojis(letterNames)*/
            if (message.guild) {
                const sql = new SQLQuery_1.SQLQuery(message);
                const pointTimeout = yield sql.fetchColumn("points", "point timeout");
                setTimeout(() => {
                    points.calcScore(message);
                }, pointTimeout ? Number(pointTimeout) : 60000);
                Block_1.Block.block(message);
                detect.detectAnime(message);
                detect.swapRoles(message);
                haiku.haiku(message);
                cmdFunctions.autoCommand(message);
            }
            const responseText = {
                kisaragi: "Kisaragi is the best girl!",
                f: `${letters.letters("F")}`,
                e: `${letters.letters("E")}`,
                b: "🅱️",
                owo: "owo",
                uwu: "uwu",
                rip: `${this.discord.getEmoji("rip")}`
            };
            const responseImage = {
                "bleh": "https://i.ytimg.com/vi/Gn4ah6kAmZo/maxresdefault.jpg",
                "smug": "https://pbs.twimg.com/media/CpfL-c3WEAE1Na_.jpg",
                "stare": "https://thumbs.gfycat.com/OpenScaryJunebug-small.gif",
                "sleepy": "https://thumbs.gfycat.com/VastBlackJackal-small.gif",
                "school shooter": "https://thumbs.gfycat.com/SmoggyDependentGrayfox-size_restricted.gif",
                "cry": "https://thumbs.gfycat.com/CompletePotableDove-small.gif",
                "pat": "https://thumbs.gfycat.com/WarmheartedAridCygnet-small.gif",
                "welcome": "https://thumbs.gfycat.com/PowerlessSparklingIcelandgull-small.gif",
                "gab s": "https://thumbs.gfycat.com/PettyWeightyArrowana-small.gif",
                "piggy back": "https://thumbs.gfycat.com/IlliterateJointAssassinbug-size_restricted.gif",
                "kick": "https://thumbs.gfycat.com/SentimentalFocusedAmericansaddlebred-small.gif",
                "punch": "https://thumbs.gfycat.com/ClearcutInexperiencedAnemone-small.gif",
                "bye": "https://i.imgur.com/2CrEDAD.gif"
            };
            if (responseText[message.content.trim().toLowerCase()]) {
                if (!message.author.bot) {
                    if (this.responseTextCool.has(message.guild.id)) {
                        const reply = yield message.reply("This command is under a 3 second cooldown!");
                        reply.delete({ timeout: 3000 });
                    }
                    this.responseTextCool.add(message.guild.id);
                    setTimeout(() => this.responseTextCool.delete(message.guild.id), 3000);
                    return message.channel.send(responseText[message.content.toLowerCase()]);
                }
            }
            if (responseImage[message.content.trim().toLowerCase()]) {
                if (!message.author.bot) {
                    if (this.responseImageCool.has(message.guild.id)) {
                        const reply = yield message.reply("This command is under a 10 second cooldown!");
                        reply.delete({ timeout: 3000 });
                    }
                    this.responseImageCool.add(message.guild.id);
                    setTimeout(() => this.responseImageCool.delete(message.guild.id), 10000);
                    return message.channel.send(new discord_js_1.MessageAttachment(responseImage[message.content.toLowerCase()]));
                }
            }
            if (message.content.trim().toLowerCase() === "i love you") {
                if (message.author.id === process.env.OWNER_ID) {
                    message.channel.send(`I love you more, <@${message.author.id}>!`);
                }
                else {
                    message.channel.send(`Sorry <@${message.author.id}>, but I don't share the same feelings. We can still be friends though!`);
                }
            }
            if (this.discord.checkBotMention(message)) {
                const args = message.content.slice(`<@!${this.discord.user.id}>`.length).trim().split(/ +/g);
                message.reply(`My prefix is set to "${prefix}"!\n`);
                if (!args[0]) {
                    cmdFunctions.runCommand(message, ["help"]);
                }
                else {
                    cmdFunctions.runCommand(message, args);
                }
            }
            if (message.content.startsWith("https")) {
                yield links.postLink(message);
                return;
            }
            if (!message.content.startsWith(prefix[0]) || message.author.bot)
                return;
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            if (args[0] === undefined)
                return;
            const cmd = args[0].toLowerCase();
            const path = yield cmdFunctions.findCommand(cmd);
            if (!path)
                return cmdFunctions.noCommand(message, cmd);
            const coolAmount = yield SQLQuery_1.SQLQuery.fetchCommand(cmd, "cooldown");
            const cmdPath = new (require(path).default)(this.discord);
            const cooldown = new Cooldown_js_1.Cooldown(this.discord, message);
            const onCooldown = cooldown.cmdCooldown(cmd, coolAmount.join(""), message, this.cooldowns);
            if (onCooldown) {
                message.channel.send(onCooldown);
                return;
            }
            const msg = yield message.channel.send(`**Loading** ${this.discord.getEmoji("gabCircle")}`);
            cmdPath.run(this.discord, message, args).then(() => {
                const msgCheck = message.channel.messages;
                if (msgCheck.has(msg.id))
                    msg.delete({ timeout: 1000 });
            }).catch((err) => message.channel.send(this.discord.cmdError(err)));
        });
    }
}
exports.default = MessageEvent;
//# sourceMappingURL=message.js.map
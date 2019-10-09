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
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Detect extends Command_1.Command {
    constructor() {
        super({
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
                detectPrompt(message);
                return;
            }
            const links = yield sql.fetchColumn("detection", "links");
            const anime = yield sql.fetchColumn("detection", "anime");
            const pfp = yield sql.fetchColumn("detection", "pfp");
            const weeb = yield sql.fetchColumn("detection", "weeb");
            const normie = yield sql.fetchColumn("detection", "normie");
            const detectEmbed = embeds.createEmbed();
            detectEmbed
                .setTitle(`**Detection Settings** ${discord.getEmoji("sagiriBleh")}`)
                .setThumbnail(message.guild.iconURL())
                .setDescription("Configure settings for automatic detection.\n" +
                "\n" +
                "**Link Detection** = Detects links and automatically runs the corresponding command.\n" +
                "**Anime Detection** = Removes all pictures that don't contain anime characters.\n" +
                "**Pfp Detection** = Actively swaps members between the weeb role (anime pfp) and normie role (non anime pfp).\n" +
                "\n" +
                "__Current Settings__\n" +
                `${star}Link detection is **${links ? links.join("") : "off"}**\n` +
                `${star}Anime detection is **${anime ? anime.join("") : "off"}**\n` +
                `${star}Pfp detection is **${pfp ? pfp.join("") : "off"}**\n` +
                `${star}Weeb role: **${weeb ? (weeb.join("") ? `<@&${weeb.join("")}>` : "None") : "None"}**\n` +
                `${star}Normie role: **${normie ? (normie.join("") ? `<@&${normie.join("")}>` : "None") : "None"}**\n` +
                "\n" +
                "__Edit Settings__\n" +
                `${star}Type **link** to toggle link detection on/off.\n` +
                `${star}Type **anime** to toggle anime detection on/off.\n` +
                `${star}Type **pfp** to toggle pfp detection on/off.\n` +
                `${star}**Mention a role or type a role id** to set the weeb role.\n` +
                `${star}Mention a role or type a role id **between brackets [role]** to set the normie role.\n` +
                `${star}You can set **multiple options at the same time**.\n` +
                `${star}Type **reset** to reset settings.\n` +
                `${star}Type **cancel** to exit.\n`);
            message.channel.send(detectEmbed);
            function detectPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    responseEmbed.setTitle(`**Detection Settings** ${discord.getEmoji("sagiriBleh")}`);
                    const dLinks = yield sql.fetchColumn("detection", "links");
                    const dAnime = yield sql.fetchColumn("detection", "anime");
                    const dPfp = yield sql.fetchColumn("detection", "pfp");
                    const dWeeb = yield sql.fetchColumn("detection", "weeb");
                    const dNormie = yield sql.fetchColumn("detection", "normie");
                    let [setLink, setAnime, setPfp, setWeeb, setNormie] = [];
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${star}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("detection", "links", "on");
                        yield sql.updateColumn("detection", "anime", "off");
                        yield sql.updateColumn("detection", "pfp", "off");
                        yield sql.updateColumn("detection", "weeb", null);
                        yield sql.updateColumn("detection", "normie", null);
                        responseEmbed
                            .setDescription(`${star}All settings were reset!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.match(/link/gi))
                        setLink = true;
                    if (msg.content.match(/anime/gi))
                        setAnime = true;
                    if (msg.content.match(/pfp/gi))
                        setPfp = true;
                    const newMsg = msg.content.replace(/<@&/g, "").replace(/>/g, "").replace(/\s+/g, "");
                    const weebRole = newMsg.replace(/(?<=\[)(.*?)(?=\])/g, "").match(/\d+/g);
                    const normieRole = newMsg.match(/(?<=\[)(.*?)(?=\])/g);
                    if (weebRole)
                        setWeeb = true;
                    if (normieRole)
                        setNormie = true;
                    let description = "";
                    if (setLink) {
                        if (!dLinks || dLinks.join("") === "off") {
                            yield sql.updateColumn("detection", "links", "on");
                            description += `${star}Link detection is **on**!\n`;
                        }
                        else {
                            yield sql.updateColumn("detection", "links", "off");
                            description += `${star}Link detection is **off**!\n`;
                        }
                    }
                    if (setAnime) {
                        if (!dAnime || dAnime.join("") === "off") {
                            yield sql.updateColumn("detection", "anime", "on");
                            description += `${star}Anime detection is **on**!\n`;
                        }
                        else {
                            yield sql.updateColumn("detection", "anime", "off");
                            description += `${star}Anime detection is **off**!\n`;
                        }
                    }
                    if (setPfp) {
                        if (!dPfp || dPfp.join("") === "off") {
                            if (!dWeeb.join("") || !dNormie.join("")) {
                                let [testWeeb, testNormie] = [];
                                if (!dWeeb.join("") && setWeeb)
                                    testWeeb = true;
                                if (!dNormie.join("") && setNormie)
                                    testNormie = true;
                                if (dWeeb.join(""))
                                    testWeeb = true;
                                if (dNormie.join(""))
                                    testNormie = true;
                                if (!(testWeeb && testNormie)) {
                                    responseEmbed
                                        .setDescription("In order to turn on pfp detection, you must set both the weeb and normie role.");
                                    message.channel.send(responseEmbed);
                                    return;
                                }
                            }
                            yield sql.updateColumn("detection", "pfp", "on");
                            description += `${star}Pfp detection is **on**!\n`;
                        }
                        else {
                            yield sql.updateColumn("detection", "pfp", "off");
                            description += `${star}Pfp detection is **off**!\n`;
                        }
                    }
                    if (setWeeb) {
                        yield sql.updateColumn("detection", "weeb", weebRole.join(""));
                        description += `${star}Weeb role set to **<@&${weebRole.join("")}>**!\n`;
                    }
                    if (setNormie) {
                        yield sql.updateColumn("detection", "normie", normieRole.join(""));
                        description += `${star}Normie role set to **<@&${normieRole.join("")}>**!\n`;
                    }
                    responseEmbed
                        .setDescription(description);
                    msg.channel.send(responseEmbed);
                    return;
                });
            }
            embeds.createPrompt(detectPrompt);
        });
    }
}
exports.default = Detect;
//# sourceMappingURL=detect.js.map
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
const Functions_1 = require("./Functions");
const SQLQuery_1 = require("./SQLQuery");
class Embeds {
    constructor(discord, message) {
        this.discord = discord;
        this.message = message;
        this.functions = new Functions_1.Functions(this.message);
        this.sql = new SQLQuery_1.SQLQuery(this.message);
        // Create Embed
        this.createEmbed = () => {
            const embed = new discord_js_1.MessageEmbed();
            embed
                .setColor(Functions_1.Functions.randomColor())
                .setTimestamp(embed.timestamp)
                .setFooter(`Responded in ${this.functions.responseTime()}`, this.discord.user.displayAvatarURL());
            return embed;
        };
        // Create Reaction Embed
        this.createReactionEmbed = (embeds, collapseOn, startPage) => {
            let page = 0;
            if (startPage)
                page = startPage;
            for (let i = 0; i < embeds.length; i++) {
                embeds[i].setFooter(`Page ${i + 1}/${embeds.length}`, this.message.author.displayAvatarURL());
            }
            const reactions = [this.discord.getEmoji("right"), this.discord.getEmoji("left"), this.discord.getEmoji("tripleRight"), this.discord.getEmoji("tripleLeft")];
            const reactionsCollapse = [this.discord.getEmoji("collapse"), this.discord.getEmoji("expand")];
            this.message.channel.send(embeds[page]).then((msg) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < reactions.length; i++)
                    yield msg.react(reactions[i]);
                yield this.sql.insertInto("collectors", "message", msg.id);
                yield this.sql.updateColumn("collectors", "embeds", embeds, "message", msg.id);
                yield this.sql.updateColumn("collectors", "collapse", collapseOn, "message", msg.id);
                yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                const forwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("right") && user.bot === false;
                const backwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("left") && user.bot === false;
                const tripleForwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("tripleRight") && user.bot === false;
                const tripleBackwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("tripleLeft") && user.bot === false;
                const forward = msg.createReactionCollector(forwardCheck);
                const backward = msg.createReactionCollector(backwardCheck);
                const tripleForward = msg.createReactionCollector(tripleForwardCheck);
                const tripleBackward = msg.createReactionCollector(tripleBackwardCheck);
                if (collapseOn) {
                    const description = [];
                    const thumbnail = [];
                    for (let i = 0; i < embeds.length; i++) {
                        description.push(embeds[i].description);
                        thumbnail.push(embeds[i].thumbnail);
                    }
                    for (const reaction of reactionsCollapse)
                        yield msg.react(reaction);
                    const collapseCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("collapse") && user.bot === false;
                    const expandCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("expand") && user.bot === false;
                    const collapse = msg.createReactionCollector(collapseCheck);
                    const expand = msg.createReactionCollector(expandCheck);
                    collapse.on("collect", (r) => {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription("");
                            embeds[i].setThumbnail("");
                        }
                        msg.edit(embeds[page]);
                        r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                    });
                    expand.on("collect", (r) => {
                        for (let i = 0; i < embeds.length; i++) {
                            embeds[i].setDescription(description[i]);
                            embeds[i].setThumbnail(thumbnail[i].url);
                        }
                        msg.edit(embeds[page]);
                        r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                    });
                }
                backward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                    if (page === 0) {
                        page = embeds.length - 1;
                    }
                    else {
                        page--;
                    }
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                }));
                forward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                    if (page === embeds.length - 1) {
                        page = 0;
                    }
                    else {
                        page++;
                    }
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                }));
                tripleBackward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                    if (page === 0) {
                        page = (embeds.length - 1) - Math.floor(embeds.length / 5);
                    }
                    else {
                        page -= Math.floor(embeds.length / 5);
                    }
                    if (page < 0)
                        page *= -1;
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                }));
                tripleForward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                    if (page === embeds.length - 1) {
                        page = 0 + Math.floor(embeds.length / 5);
                    }
                    else {
                        page += Math.floor(embeds.length / 5);
                    }
                    if (page > embeds.length - 1)
                        page -= embeds.length - 1;
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                }));
            }));
        };
        // Re-trigger Existing Reaction Embed
        this.editReactionCollector = (msg, emoji, embeds, collapseOn, startPage) => __awaiter(this, void 0, void 0, function* () {
            let page = 0;
            if (startPage)
                page = startPage;
            const description = [];
            const thumbnail = [];
            for (let i = 0; i < embeds.length; i++) {
                description.push(embeds[i].description);
                thumbnail.push(embeds[i].thumbnail);
            }
            switch (emoji) {
                case "right":
                    if (page === embeds.length - 1) {
                        page = 0;
                    }
                    else {
                        page++;
                    }
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    break;
                case "left":
                    if (page === 0) {
                        page = embeds.length - 1;
                    }
                    else {
                        page--;
                    }
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                    break;
                case "tripleRight":
                    if (page === embeds.length - 1) {
                        page = 0;
                    }
                    else {
                        page++;
                    }
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                case "tripleLeft":
                    if (page === 0) {
                        page = (embeds.length - 1) - Math.floor(embeds.length / 5);
                    }
                    else {
                        page -= Math.floor(embeds.length / 5);
                    }
                    if (page < 0)
                        page *= -1;
                    yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                    msg.edit(embeds[page]);
                case "collapse":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("");
                        embeds[i].setThumbnail("");
                    }
                    msg.edit(embeds[page]);
                    break;
                case "expand":
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i]);
                        embeds[i].setThumbnail(thumbnail[i].url);
                    }
                    msg.edit(embeds[page]);
                default:
            }
            const forwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("right") && user.bot === false;
            const backwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("left") && user.bot === false;
            const tripleForwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("tripleRight") && user.bot === false;
            const tripleBackwardCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("tripleLeft") && user.bot === false;
            const forward = msg.createReactionCollector(forwardCheck);
            const backward = msg.createReactionCollector(backwardCheck);
            const tripleForward = msg.createReactionCollector(tripleForwardCheck);
            const tripleBackward = msg.createReactionCollector(tripleBackwardCheck);
            if (collapseOn) {
                const collapseCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("collapse") && user.bot === false;
                const expandCheck = (reaction, user) => reaction.emoji === this.discord.getEmoji("expand") && user.bot === false;
                const collapse = msg.createReactionCollector(collapseCheck);
                const expand = msg.createReactionCollector(expandCheck);
                collapse.on("collect", (r) => {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription("");
                        embeds[i].setThumbnail("");
                    }
                    msg.edit(embeds[page]);
                    r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                });
                expand.on("collect", (r) => {
                    for (let i = 0; i < embeds.length; i++) {
                        embeds[i].setDescription(description[i]);
                        embeds[i].setThumbnail(thumbnail[i].url);
                    }
                    msg.edit(embeds[page]);
                    r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
                });
            }
            backward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                if (page === 0) {
                    page = embeds.length - 1;
                }
                else {
                    page--;
                }
                yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
            }));
            forward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                if (page === embeds.length - 1) {
                    page = 0;
                }
                else {
                    page++;
                }
                yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
            }));
            tripleBackward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                if (page === 0) {
                    page = (embeds.length - 1) - Math.floor(embeds.length / 5);
                }
                else {
                    page -= Math.floor(embeds.length / 5);
                }
                if (page < 0)
                    page *= -1;
                yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
            }));
            tripleForward.on("collect", (r) => __awaiter(this, void 0, void 0, function* () {
                if (page === embeds.length - 1) {
                    page = 0 + Math.floor(embeds.length / 5);
                }
                else {
                    page += Math.floor(embeds.length / 5);
                }
                if (page > embeds.length - 1)
                    page -= embeds.length - 1;
                yield this.sql.updateColumn("collectors", "page", page, "message", msg.id);
                msg.edit(embeds[page]);
                r.users.remove(r.users.find((u) => u.id !== this.discord.user.id));
            }));
        });
        // Create Prompt
        this.createPrompt = (func) => {
            const filter = (m) => m.author.id === this.message.author.id && m.channel === this.message.channel;
            const collector = this.message.channel.createMessageCollector(filter, { time: 60000 });
            collector.on("collect", (m) => {
                func(m, collector);
                collector.stop();
            });
        };
    }
}
exports.Embeds = Embeds;
//# sourceMappingURL=Embeds.js.map
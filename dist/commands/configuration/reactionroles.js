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
class ReactionRoles extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const perms = new Permissions_1.Permissions(discord, message);
            if (yield perms.checkMod(message))
                return;
            const input = Functions_1.Functions.combineArgs(args, 1);
            if (input.trim()) {
                message.content = input.trim();
                reactPrompt(message);
                return;
            }
            /*
            {"message": messageID, "emoji": "emojiName", "role": roleID}
            */
            let messages = yield sql.fetchColumn("reaction", "message");
            let emojis = yield sql.fetchColumn("reaction", "emoji");
            let roles = yield sql.fetchColumn("reaction", "role");
            let states = yield sql.fetchColumn("reaction", "state");
            messages = JSON.parse(messages[0]);
            emojis = JSON.parse(emojis[0]);
            roles = JSON.parse(roles[0]);
            states = JSON.parse(states[0]);
            const step = 3.0;
            const increment = Math.ceil((messages[0] ? messages.length : 1) / step);
            const reactArray = [];
            for (let i = 0; i < increment; i++) {
                let settings = "";
                for (let j = 0; j < step; j++) {
                    if (messages[0] || emojis[0] || roles[0] || states[0]) {
                        const value = (i * step) + j;
                        if (!messages.join("") || !emojis[0] || !roles[0] || !states[0])
                            settings = "None";
                        if (!messages[value])
                            break;
                        const foundMsg = yield discord.fetchMessage(message, messages[value]);
                        const identifier = message.guild.emojis.find((e) => {
                            if (e.name.toLowerCase().includes(emojis[value].toLowerCase())) {
                                return e.identifier;
                            }
                        });
                        settings += `${i + 1} **=>**\n` +
                            `${discord.getEmoji("star")}_Message:_ [Link](${foundMsg.url})\n` +
                            `${discord.getEmoji("star")}_Emoji:_ ${identifier}\n` +
                            `${discord.getEmoji("star")}_Role:_ <@&${roles[value]}>\n`;
                    }
                    else {
                        settings = "None";
                    }
                }
                const reactEmbed = embeds.createEmbed();
                reactEmbed
                    .setTitle(`**Reaction Roles** ${discord.getEmoji("aquaUp")}`)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`Add and remove reaction roles.\n` +
                    "\n" +
                    "__Current Settings__\n" +
                    settings + "\n" +
                    "\n" +
                    "__Edit Settings__\n" +
                    `${discord.getEmoji("star")}Type a **message id** to set the message.\n` +
                    `${discord.getEmoji("star")}**Mention a role or type a role id** to set the role.\n` +
                    `${discord.getEmoji("star")}**Type an emoji or emoji name** to set the emoji.\n` +
                    `${discord.getEmoji("star")}Type **delete (setting number)** to delete a setting.\n` +
                    `${discord.getEmoji("star")}Type **edit (setting number)** to edit a setting.\n` +
                    `${discord.getEmoji("star")}Type **toggle (setting number)** to toggle the state.\n` +
                    `${discord.getEmoji("star")}Type **reset** to delete all settings.\n` +
                    `${discord.getEmoji("star")}Type **cancel** to exit.\n`);
                reactArray.push(reactEmbed);
            }
            if (reactArray.length > 1) {
                embeds.createReactionEmbed(reactArray);
            }
            else {
                message.channel.send(reactArray[0]);
            }
            function reactPrompt(msg) {
                return __awaiter(this, void 0, void 0, function* () {
                    const responseEmbed = embeds.createEmbed();
                    if (msg.content.toLowerCase() === "cancel") {
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}Canceled the prompt!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                    if (msg.content.toLowerCase() === "reset") {
                        yield sql.updateColumn("special roles", "reaction roles", null);
                        responseEmbed
                            .setDescription(`${discord.getEmoji("star")}Reaction role settings were wiped!`);
                        msg.channel.send(responseEmbed);
                        return;
                    }
                });
            }
            embeds.createPrompt(reactPrompt);
        });
    }
}
exports.default = ReactionRoles;
//# sourceMappingURL=reactionroles.js.map
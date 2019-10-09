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
class Set extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            if (perms.checkBotDev(message))
                return;
            const activityType = args[1].toUpperCase();
            const activityName = Functions_1.Functions.combineArgs(args, 2);
            const activityTypes = ["PLAYING", "WATCHING", "LISTENING", "STREAMING"];
            const setEmbed = embeds.createEmbed();
            if (!activityName || (!activityTypes.includes(activityType.toString()))) {
                message.channel.send(setEmbed
                    .setDescription("Correct usage is =>set (type) (activity), where (type) is playing, watching, listening, or streaming."));
            }
            if (activityType === "STREAMING") {
                discord.user.setActivity(activityName, { url: "https://www.twitch.tv/tenpimusic", type: activityType });
                message.channel.send(setEmbed
                    .setDescription(`I am now ${activityType} ${activityName}`));
                return;
            }
            discord.user.setActivity(activityName, { type: activityType });
            message.channel.send(setEmbed
                .setDescription(`I am now ${activityType} ${activityName}`));
        });
    }
}
exports.default = Set;
//# sourceMappingURL=set.js.map
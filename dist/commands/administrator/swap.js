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
const Detector_1 = require("./../../structures/Detector");
const Embeds_1 = require("./../../structures/Embeds");
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Swap extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const detect = new Detector_1.Detector(discord);
            const star = discord.getEmoji("star");
            if (yield perms.checkAdmin(message))
                return;
            const pfp = yield sql.fetchColumn("detection", "pfp");
            const weeb = yield sql.fetchColumn("detection", "weeb");
            const normie = yield sql.fetchColumn("detection", "normie");
            if (pfp.join("") === "off")
                return;
            let weebCounter = 0;
            let normieCounter = 0;
            const wait = yield message.channel.send(`**Scanning every member in the server. This will take awhile** ${discord.getEmoji("gabCircle")}`);
            for (let i = 0; i < message.guild.members.size; i++) {
                const memberArray = message.guild.members.map((m) => m);
                const result = yield detect.swapRoles(message, memberArray[i], true);
                if (result === true) {
                    weebCounter += 1;
                }
                else if (result === false) {
                    normieCounter += 1;
                }
            }
            yield wait.delete({ timeout: 1000 });
            const swapEmbed = embeds.createEmbed();
            swapEmbed
                .setTitle(`**Role Swapping** ${discord.getEmoji("gabYes")}`)
                .setDescription(`${star}**${weebCounter}** members were swapped into the <@&${weeb.join("")}> role.\n` +
                `${star}**${normieCounter}** members were swapped into the <@&${normie.join("")}> role.\n`);
            message.channel.send(swapEmbed);
        });
    }
}
exports.default = Swap;
//# sourceMappingURL=swap.js.map
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
class SQL extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            if (perms.checkBotDev(message))
                return;
            const query = { text: Functions_1.Functions.combineArgs(args, 1), rowMode: "array" };
            const sqlEmbed = embeds.createEmbed();
            let result;
            try {
                result = yield SQLQuery_1.SQLQuery.runQuery(query, true);
                console.log(result);
            }
            catch (err) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
            }
            sqlEmbed
                .setTitle(`**SQL Query** ${discord.getEmoji("karenAnger")}`)
                .setDescription(`Successfully ran the query **${query.text}**\n` +
                "\n" +
                `**${result ? (result[0][0] ? result[0].length : result.length) : 0}** rows were selected!\n` +
                "\n" +
                `\`\`\`${Functions_1.Functions.checkChar(JSON.stringify(result), 2000, ",")}\`\`\``);
            message.channel.send(sqlEmbed);
        });
    }
}
exports.default = SQL;
//# sourceMappingURL=sql.js.map
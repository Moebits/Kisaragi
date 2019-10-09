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
class Clean extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.clean = (text) => {
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        };
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            if (perms.checkBotDev(message))
                return;
            const evalEmbed = embeds.createEmbed();
            try {
                const code = Functions_1.Functions.combineArgs(args, 1);
                let evaled = eval(code);
                if (typeof evaled !== "string") {
                    evaled = require("util").inspect(evaled);
                }
                evalEmbed
                    .setTitle(`**Javascript Code Eval** ${discord.getEmoji("kaosWTF")}`)
                    .setDescription(this.clean(evaled));
                message.channel.send(evalEmbed);
            }
            catch (error) {
                message.channel.send(`\`ERROR\` \`\`\`xl\n${this.clean(error)}\n\`\`\``);
            }
        });
    }
}
exports.default = Clean;
//# sourceMappingURL=eval.js.map
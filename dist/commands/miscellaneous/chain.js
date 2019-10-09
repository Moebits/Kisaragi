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
const CommandFunctions_1 = require("./../../structures/CommandFunctions");
class Chain extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const commands = new CommandFunctions_1.CommandFunctions(discord);
            const cmdArgs = args.join(" ").split("& ");
            for (let i = 0; i < cmdArgs.length; i++) {
                const loading = yield message.channel.send(`**Running Chain ${i + 1}** ${discord.getEmoji("gabCircle")}`);
                yield commands.runCommand(message, cmdArgs[i].replace(/chain/g, "").split(" "));
                loading.delete({ timeout: 1000 });
            }
        });
    }
}
exports.default = Chain;
//# sourceMappingURL=chain.js.map
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
const Permissions_1 = require("./../../structures/Permissions");
const SQLQuery_1 = require("./../../structures/SQLQuery");
class Reboot extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.unloadCommand = (commandName) => __awaiter(this, void 0, void 0, function* () {
            const mod = require.cache[require.resolve(`../commands/$${commandName}`)];
            delete require.cache[require.resolve(`../commands/${commandName}.js`)];
            for (let i = 0; i < mod.parent.children.length; i++) {
                if (mod.parent.children[i] === mod) {
                    mod.parent.children.splice(i, 1);
                    break;
                }
            }
            return false;
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            const embeds = new Embeds_1.Embeds(discord, message);
            const sql = new SQLQuery_1.SQLQuery(message);
            const commands = yield sql.fetchColumn("commands", "command");
            if (perms.checkBotDev(message))
                return;
            const rebootEmbed = embeds.createEmbed();
            yield message.channel.send(rebootEmbed
                .setDescription("Bot is shutting down."));
            yield Promise.all(commands.map((cmd) => this.unloadCommand(cmd)));
            process.exit(0);
        });
    }
}
exports.default = Reboot;
//# sourceMappingURL=reboot.js.map
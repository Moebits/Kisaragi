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
class Reload extends Command_1.Command {
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
            const reloadEmbed = embeds.createEmbed();
            const commandName = args[1];
            const commandDir = args[2];
            if (!args[1]) {
                return message.channel.send(reloadEmbed
                    .setDescription(`Correct usage is =>reload (command) (dir)`));
            }
            delete require.cache[require.resolve(`../${commandDir}/${commandName}.js`)];
            require(`../${commandDir}/${commandName}.js`);
            message.channel.send(reloadEmbed
                .setDescription(`The command **${commandName}** has been reloaded!`));
        });
    }
}
exports.default = Reload;
//# sourceMappingURL=reload.js.map
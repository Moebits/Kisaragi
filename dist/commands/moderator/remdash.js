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
class Remdash extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            if (yield perms.checkMod(message))
                return;
            const remEmbed = embeds.createEmbed();
            const nameArray = message.guild.channels.map((c) => c.name);
            const idArray = message.guild.channels.map((c) => c.id);
            for (let i = 0; i < nameArray.length; i++) {
                if (nameArray[i].includes("-")) {
                    const newName = nameArray[i].replace(/-/g, " ");
                    const channel = message.guild.channels.find((c) => c.id === idArray[i]);
                    yield channel.setName(newName);
                }
            }
            remEmbed
                .setDescription("Removed dashes from all channel names!");
            message.channel.send(remEmbed);
            return;
        });
    }
}
exports.default = Remdash;
//# sourceMappingURL=remdash.js.map
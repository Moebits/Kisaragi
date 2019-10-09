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
class Role extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const embeds = new Embeds_1.Embeds(discord, message);
            const perms = new Permissions_1.Permissions(discord, message);
            if (yield perms.checkMod(message))
                return;
            const roleEmbed = embeds.createEmbed();
            if ((!args[3]) || (message.mentions.members.size === 0)) {
                return message.channel.send(roleEmbed
                    .setDescription("You must type =>role <add or del> [user] [role]"));
            }
            else {
                const member = message.mentions.members.first();
                const roleName = args[3];
                const snowflake = /\d+/;
                let roleID = roleName.substring(roleName.search(snowflake));
                if (roleID.includes(">"))
                    roleID = roleID.slice(0, -1);
                const role = message.guild.roles.get(roleID);
                switch (args[1]) {
                    case "add": {
                        try {
                            yield member.roles.add(role);
                            yield message.channel.send(roleEmbed
                                .setDescription(`${member.displayName} now has the ${role} role!`));
                        }
                        catch (error) {
                            discord.cmdError(message, error);
                            message.channel.send(roleEmbed
                                .setDescription(`The role **${roleName}** could not be found.`));
                        }
                        break;
                    }
                    case "del": {
                        try {
                            yield member.roles.remove(role);
                            yield message.channel.send(roleEmbed
                                .setDescription(`${member.displayName} no longer has the ${role} role!`));
                        }
                        catch (error) {
                            discord.cmdError(message, error);
                            message.channel.send(roleEmbed
                                .setDescription(`The role **${roleName}** could not be found.`));
                        }
                    }
                    default:
                }
            }
        });
    }
}
exports.default = Role;
//# sourceMappingURL=role.js.map
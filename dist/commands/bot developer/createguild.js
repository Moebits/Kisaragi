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
const Permissions_1 = require("./../../structures/Permissions");
class CreateGuild extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.createGuild = (discord, message, guildName, guildRegion) => __awaiter(this, void 0, void 0, function* () {
            const perms = new Permissions_1.Permissions(discord, message);
            if (perms.checkBotDev(message))
                return;
            try {
                const guild = yield discord.user.createGuild(guildName, guildRegion);
                const defaultChannel = guild.channels.find((channel) => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
                const invite = yield defaultChannel.createInvite();
                yield message.author.send(invite.url);
                const role = yield guild.createRole({ name: "Administrator", permissions: ["ADMINISTRATOR"] });
                yield message.author.send(role.id);
                yield message.channel.send(`I made a guild! The invite is ${invite.url} The Administrator role ID is ${role.id}.`);
            }
            catch (error) {
                discord.cmdError();
            }
        });
        this.run = (discord, message, args) => __awaiter(this, void 0, void 0, function* () {
            const guildName = args[1];
            const guildRegion = args[2];
            yield this.createGuild(discord, message, guildName, guildRegion);
        });
    }
}
exports.default = CreateGuild;
//# sourceMappingURL=createguild.js.map
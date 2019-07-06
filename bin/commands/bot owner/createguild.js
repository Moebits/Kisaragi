"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const createGuild = (client, message, guildName, guildRegion) => __awaiter(this, void 0, void 0, function* () {
    try {
        const guild = yield client.user.createGuild(guildName, guildRegion);
        const defaultChannel = guild.channels.find((channel) => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
        const invite = yield defaultChannel.createInvite();
        yield message.author.send(invite.url);
        yield message.channel.send(`I made a guild! The invite it ${invite.url}`);
        const role = yield guild.createRole({ name: "Administrator", permissions: ["ADMINISTRATOR"] });
        yield message.author.send(role.id);
    }
    catch (error) {
        console.error(error);
    }
});
exports.run = (client, message, args) => {
    const evalEmbed = client.createEmbed();
    const guildName = args[0];
    const guildRegion = args[1];
    if (client.checkBotOwner()) {
        client.createGuild(client, message, guildName, guildRegion);
    }
    else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."));
        return;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlZ3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tYW5kcy9ib3Qgb3duZXIvY3JlYXRlZ3VpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsTUFBTSxXQUFXLEdBQUcsQ0FBTyxNQUFXLEVBQUUsT0FBWSxFQUFFLFNBQWlCLEVBQUUsV0FBbUIsRUFBRSxFQUFFO0lBRTVGLElBQUk7UUFDQSxNQUFNLEtBQUssR0FBUSxNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RSxNQUFNLGNBQWMsR0FBUSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQVksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDekgsTUFBTSxNQUFNLEdBQVEsTUFBTSxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDeEQsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDMUUsTUFBTSxJQUFJLEdBQVEsTUFBTSxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDbEcsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FFdEM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3BCO0FBQ0wsQ0FBQyxDQUFBLENBQUE7QUFFRCxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBVyxFQUFFLE9BQVksRUFBRSxJQUFjLEVBQUUsRUFBRTtJQUV4RCxNQUFNLFNBQVMsR0FBUSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDNUMsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVwQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUUsRUFBRTtRQUV4QixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBRS9EO1NBQU07UUFDSCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTO2FBQ3pCLGNBQWMsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDLENBQUE7UUFDMUUsT0FBTztLQUNkO0FBQ0wsQ0FBQyxDQUFBIn0=
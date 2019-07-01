var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function createGuild(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const guild = yield client.user.createGuild('Example Guild', 'london');
            const defaultChannel = guild.channels.find(channel => channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
            const invite = yield defaultChannel.createInvite();
            yield message.author.send(invite.url);
            yield message.channel.send(`I made a guild! The invite it ${invite.url}`);
            const role = yield guild.createRole({ name: 'Example Role', permissions: ['ADMINISTRATOR'] });
            yield message.author.send(role.id);
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.run = (client, message, args) => {
    const evalEmbed = client.createEmbed();
    if (client.checkBotOwner()) {
        client.user.createGuild('Example Guild', 'london').then(guild => {
            guild.channels.get(guild.id).createInvite()
                .then(invite => client.users.get(ownerID).send(invite.url));
            guild.createRole({ name: 'Example Role', permissions: ['ADMINISTRATOR'] })
                .then(role => client.users.get(ownerID).send(role.id))
                .catch(error => console.log(error));
        });
        createGuild(client, message);
    }
    else {
        message.channel.send(evalEmbed
            .setDescription("In order to use this command, you must be a bot owner."))
            .catch(error => console.log("Caught", error.message));
        return;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlZ3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tYW5kcy9ib3Qgb3duZXIvY3JlYXRlZ3VpbGQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxTQUFlLFdBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTzs7UUFDdEMsSUFBSTtZQUNBLE1BQU0sS0FBSyxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDN0csTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbkQsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDMUUsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFDLGNBQWMsRUFBRSxXQUFXLEVBQUMsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDNUYsTUFBTSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdEM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDaEI7SUFDTCxDQUFDO0NBQUE7QUFFRCxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUVwQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFdkMsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLEVBQUU7UUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM1RCxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFO2lCQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFDLElBQUksRUFBQyxjQUFjLEVBQUUsV0FBVyxFQUFDLENBQUMsZUFBZSxDQUFDLEVBQUMsQ0FBQztpQkFDakUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDckQsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO1FBQzNDLENBQUMsQ0FBQyxDQUFDO1FBRUgsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUVoQztTQUFNO1FBQ0gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUzthQUN6QixjQUFjLENBQUMsd0RBQXdELENBQUMsQ0FBQzthQUN6RSxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNyRCxPQUFPO0tBQ2Q7QUFDTCxDQUFDLENBQUEifQ==
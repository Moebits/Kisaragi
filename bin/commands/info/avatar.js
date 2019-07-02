var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
exports.run = (client, message, args) => __awaiter(this, void 0, void 0, function* () {
    const avatarEmbed = client.createEmbed();
    if (!message.mentions.users.size) {
        if (message.author.displayAvatarURL.includes("gif" || "jpg")) {
            yield message.channel.send(avatarEmbed
                .setDescription(`**${message.author.username}'s Profile Picture**`)
                .setImage(`${message.author.displayAvatarURL}` + "?size=2048"));
        }
        else {
            yield message.channel.send(avatarEmbed
                .setDescription(`**${message.author.username}'s Profile Picture**`)
                .setImage(message.author.displayAvatarURL));
        }
    }
    for (var [, user] of message.mentions.users) {
        if (user.displayAvatarURL.includes("gif" || "jpg")) {
            yield message.channel.send(avatarEmbed
                .setDescription(`**${user.username}'s Profile Picture**`)
                .setImage(`${user.displayAvatarURL}` + "?size=2048"));
        }
        else {
            yield message.channel.send(avatarEmbed
                .setDescription(`**${user.username}'s Profile Picture**`)
                .setImage(user.displayAvatarURL));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvaW5mby9hdmF0YXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsR0FBRyxHQUFHLENBQU8sTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRTtJQUU3QyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtRQUNwQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsRUFBRTtZQUM3RCxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7aUJBQ3BDLGNBQWMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxzQkFBc0IsQ0FBQztpQkFDbEUsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDakU7YUFBTTtZQUNOLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVztpQkFDcEMsY0FBYyxDQUFDLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLHNCQUFzQixDQUFDO2lCQUNsRSxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7U0FDN0M7S0FDRDtJQUVELEtBQUssSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUU7UUFDNUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNuRCxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7aUJBQ3BDLGNBQWMsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLHNCQUFzQixDQUFDO2lCQUN4RCxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ3ZEO2FBQU07WUFDTixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7aUJBQ3BDLGNBQWMsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLHNCQUFzQixDQUFDO2lCQUN4RCxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUNuQztLQUNEO0FBQ0YsQ0FBQyxDQUFBLENBQUMifQ==
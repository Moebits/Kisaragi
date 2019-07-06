"use strict";
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
    for (let [, user] of message.mentions.users) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXZhdGFyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvaW5mby9hdmF0YXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFPLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFFakUsTUFBTSxXQUFXLEdBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRTNDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7UUFDcEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDN0QsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXO2lCQUNwQyxjQUFjLENBQUMsS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsc0JBQXNCLENBQUM7aUJBQ2xFLFFBQVEsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO2FBQU07WUFDTixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVc7aUJBQ3BDLGNBQWMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxzQkFBc0IsQ0FBQztpQkFDbEUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1NBQzdDO0tBQ0Q7SUFFRCxLQUFLLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFO1FBQzVDLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDbkQsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXO2lCQUNwQyxjQUFjLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxzQkFBc0IsQ0FBQztpQkFDeEQsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQztTQUN2RDthQUFNO1lBQ04sTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXO2lCQUNwQyxjQUFjLENBQUMsS0FBSyxJQUFJLENBQUMsUUFBUSxzQkFBc0IsQ0FBQztpQkFDeEQsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7U0FDbkM7S0FDRDtBQUNGLENBQUMsQ0FBQSxDQUFDIn0=
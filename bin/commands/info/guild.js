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
    if (args[0] = "icon") {
        const guildIconEmbed = client.createEmbed();
        if (message.guild.available) {
            yield message.channel.send(guildIconEmbed
                .setDescription(`**${message.guild.name}'s Guild Icon**`)
                .setImage(`${message.guild.iconURL}` + "?size=2048"));
        }
        else {
            message.channel.send(guildIconEmbed
                .setDescription(`Could not retrieve this guild's icon.`));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tYW5kcy9pbmZvL2d1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBTyxNQUFXLEVBQUUsT0FBWSxFQUFFLElBQWMsRUFBRSxFQUFFO0lBRTlELElBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRTtRQUNqQixNQUFNLGNBQWMsR0FBUSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFakQsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUV6QixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWM7aUJBQ3BDLGNBQWMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztpQkFDeEQsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO1NBRTdEO2FBQU07WUFDSCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjO2lCQUM5QixjQUFjLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO0tBQ0o7QUFDTCxDQUFDLENBQUEsQ0FBQSJ9
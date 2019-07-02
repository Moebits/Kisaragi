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
            if (message.guild.iconURL.includes("jpg")) {
                yield message.channel.send(guildIconEmbed
                    .setDescription(`**${message.guild.name}'s Guild Icon**`)
                    .setImage(`${message.guild.iconURL}` + "?size=2048"));
            }
            else {
                yield message.channel.send(guildIconEmbed
                    .setDescription(`**${message.guild.name}'s Guild Icon**`)
                    .setImage(`${message.guild.iconURL}` + "?size=2048"));
            }
        }
        else {
            message.channel.send(guildIconEmbed
                .setDescription(`Could not retrieve this guild's icon.`));
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tYW5kcy9pbmZvL2d1aWxkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFPLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFFMUMsSUFBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUFFO1FBRWpCLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUU1QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO1lBRXpCLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN2QyxNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWM7cUJBQ3BDLGNBQWMsQ0FBQyxLQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztxQkFDeEQsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDO2FBQzdEO2lCQUFNO2dCQUNILE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYztxQkFDcEMsY0FBYyxDQUFDLEtBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLGlCQUFpQixDQUFDO3FCQUN4RCxRQUFRLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7YUFDN0Q7U0FFSjthQUFNO1lBQ0gsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYztpQkFDOUIsY0FBYyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQztTQUNqRTtLQUNKO0FBRUwsQ0FBQyxDQUFBLENBQUEifQ==
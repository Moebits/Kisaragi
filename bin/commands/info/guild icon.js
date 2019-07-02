var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
exports.run = (client, message, args) => __awaiter(this, void 0, void 0, function* () {
    const guildIconEmbed = client.createEmbed();
    if (client.guild.available) {
        if (client.guild.iconURL.includes("gif")) {
            yield message.channel.send(guildIconEmbed
                .setDescription(`**${client.guild.name}'s Guild Icon**`)
                .setImage(`${client.guild.iconURL}` + "?size=2048"));
        }
        else {
            yield message.channel.send(guildIconEmbed
                .setDescription(`**${client.guild.name}'s Guild Icon**`)
                .setImage(client.guild.iconURL));
        }
    }
    else {
        message.channel.send(guildIconEmbed
            .setDescription(`Could not retrieve this guild's icon.`));
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VpbGQgaWNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1hbmRzL2luZm8vZ3VpbGQgaWNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBTyxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO0lBRTFDLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUU1QyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO1FBRXhCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQy9DLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYztpQkFDdkMsY0FBYyxDQUFDLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLGlCQUFpQixDQUFDO2lCQUN2RCxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDbkQ7YUFBTTtZQUNULE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYztpQkFDdkMsY0FBYyxDQUFDLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLGlCQUFpQixDQUFDO2lCQUN2RCxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQzVCO0tBRUo7U0FBTTtRQUNILE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWM7YUFDOUIsY0FBYyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsQ0FBQztLQUNqRTtBQUVMLENBQUMsQ0FBQSxDQUFBIn0=
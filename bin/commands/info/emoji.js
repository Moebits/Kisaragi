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
    const emojiEmbed = client.createEmbed();
    if (args[0] === "list") {
        const emojiList = message.guild.emojis.map((e) => e.toString()).join(" ");
        message.channel.send(emojiEmbed
            .setTitle("**Only shows the first 2000 characters.**")
            .setDescription(emojiList.slice(0, 2000)));
        return;
    }
    const emojiName = args[0];
    if (!emojiName.includes("<" || ">")) {
        const emojiFound = client.emojis.find((emoji) => emoji.identifier === emojiName);
        if (emojiFound === null) {
            message.channel.send(emojiEmbed
                .setDescription("Could not find that emoji!"));
            return;
        }
        message.channel.send(emojiEmbed
            .setDescription(`**${emojiName} Emoji**`)
            .setImage(`${emojiFound.url}`));
        return;
    }
    let snowflake = /\d+/;
    let emojiID = emojiName.substring(emojiName.search(snowflake));
    if (emojiID.includes(">")) {
        emojiID = emojiID.slice(0, -1);
    }
    if (typeof parseInt(emojiID) === "number") {
        let emojiGet = client.emojis.get(emojiID);
        message.channel.send(emojiEmbed
            .setDescription(`**${emojiGet.name} Emoji**`)
            .setImage(emojiGet.url));
        return;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tYW5kcy9pbmZvL2Vtb2ppLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBTyxNQUFXLEVBQUUsT0FBWSxFQUFFLElBQWMsRUFBRSxFQUFFO0lBRTlELE1BQU0sVUFBVSxHQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUU3QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7UUFDcEIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFDLEVBQUUsQ0FBQSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0UsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVTthQUMxQixRQUFRLENBQUMsMkNBQTJDLENBQUM7YUFDckQsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxPQUFPO0tBQ1Y7SUFFRCxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFO1FBRWpDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxDQUFDO1FBQ3RGLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtZQUNyQixPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVO2lCQUMxQixjQUFjLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO1lBQ25ELE9BQU87U0FDVjtRQUNELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVU7YUFDMUIsY0FBYyxDQUFDLEtBQUssU0FBUyxVQUFVLENBQUM7YUFDeEMsUUFBUSxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxPQUFPO0tBRVY7SUFFTCxJQUFJLFNBQVMsR0FBVyxLQUFLLENBQUM7SUFDOUIsSUFBSSxPQUFPLEdBQVcsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDdkUsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FBQztJQUU1RCxJQUFJLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUN2QyxJQUFJLFFBQVEsR0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVO2FBQzFCLGNBQWMsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxJQUFJLFVBQVUsQ0FBQzthQUM1QyxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDeEIsT0FBTztLQUNkO0FBQ0wsQ0FBQyxDQUFBLENBQUEifQ==
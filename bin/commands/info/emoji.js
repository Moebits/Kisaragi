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
        const emojiList = message.guild.emojis.map(e => e.toString()).join(" ");
        message.channel.send(emojiEmbed
            .setTitle("**Only shows the first 2000 characters.**")
            .setDescription(emojiList.slice(0, 2000)));
        return;
    }
    const emojiName = args[0];
    if (!emojiName.includes("<" || ">")) {
        const emojiFound = client.emojis.find(emoji => emoji.name === emojiName);
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
    var snowflake = /\d+/;
    var emojiID = emojiName.substring(emojiName.search(snowflake));
    if (emojiID.includes(">")) {
        emojiID = emojiID.slice(0, -1);
    }
    if (typeof parseInt(emojiID) === "number") {
        var emojiGet = client.emojis.get(emojiID);
        message.channel.send(emojiEmbed
            .setDescription(`**${emojiGet.name} Emoji**`)
            .setImage(emojiGet.url));
        return;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tYW5kcy9pbmZvL2Vtb2ppLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFPLE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFFMUMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBRXhDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtRQUNwQixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBLEVBQUUsQ0FBQSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVTthQUMxQixRQUFRLENBQUMsMkNBQTJDLENBQUM7YUFDckQsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxPQUFPO0tBQ1Y7SUFFRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFO1FBRWpDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQztRQUN6RSxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDckIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVTtpQkFDMUIsY0FBYyxDQUFDLDRCQUE0QixDQUFDLENBQUMsQ0FBQztZQUNuRCxPQUFPO1NBQ1Y7UUFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVO2FBQzFCLGNBQWMsQ0FBQyxLQUFLLFNBQVMsVUFBVSxDQUFDO2FBQ3hDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEMsT0FBTztLQUVWO0lBRUwsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQy9ELElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQUM7SUFFNUQsSUFBSSxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7UUFDdkMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVTthQUMxQixjQUFjLENBQUMsS0FBSyxRQUFRLENBQUMsSUFBSSxVQUFVLENBQUM7YUFDNUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3hCLE9BQU87S0FDZDtBQUdMLENBQUMsQ0FBQSxDQUFBIn0=
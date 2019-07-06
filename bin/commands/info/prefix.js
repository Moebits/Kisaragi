"use strict";
exports.run = (client, message, newPrefix) => {
    let config = require("../../../config.json");
    config.prefix = newPrefix;
    const prefixEmbed = client.createEmbed();
    prefixEmbed
        .setDescription("The prefix has been changed to " + newPrefix + "\n" + "If you ever forget the prefix just tag me!");
    message.channel.send(prefixEmbed);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZml4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbWFuZHMvaW5mby9wcmVmaXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFXLEVBQUUsT0FBWSxFQUFFLFNBQWlCLEVBQUUsRUFBRTtJQUUzRCxJQUFJLE1BQU0sR0FBUSxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUVsRCxNQUFNLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUUxQixNQUFNLFdBQVcsR0FBUSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDOUMsV0FBVztTQUNWLGNBQWMsQ0FBQyxpQ0FBaUMsR0FBRyxTQUFTLEdBQUcsSUFBSSxHQUFHLDRDQUE0QyxDQUFDLENBQUE7SUFDcEgsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFFckMsQ0FBQyxDQUFBIn0=
"use strict";
module.exports = (client) => {
    let chalk = require("chalk");
    let moment = require("moment");
    const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
    let logString = `${timestamp} Logged in as ${client.user.tag}!`;
    let readyString = `${timestamp} Ready in ${client.guilds.size} guilds on ${client.channels.size} channels, for a total of ${client.users.size} users.`;
    console.log(chalk `{magentaBright ${logString}}`);
    console.log(chalk `{magentaBright ${readyString}}`);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMvcmVhZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxNQUFXLEVBQUUsRUFBRTtJQUU3QixJQUFJLEtBQUssR0FBUSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEMsSUFBSSxNQUFNLEdBQVEsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRXBDLE1BQU0sU0FBUyxHQUFXLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQztJQUV6RSxJQUFJLFNBQVMsR0FBVyxHQUFHLFNBQVMsaUJBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDeEUsSUFBSSxXQUFXLEdBQVcsR0FBRyxTQUFTLGFBQWEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGNBQWMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLDZCQUE2QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDO0lBRS9KLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBRXZELENBQUMsQ0FBQSJ9
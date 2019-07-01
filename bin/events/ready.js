module.exports = (client) => {
    let chalk = require("chalk");
    let moment = require("moment");
    const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
    var logString = `${timestamp} Logged in as ${client.user.tag}!`;
    var readyString = `${timestamp} Ready in ${client.guilds.size} guilds on ${client.channels.size} channels, for a total of ${client.users.size} users.`;
    console.log(chalk `{magentaBright ${logString}}`);
    console.log(chalk `{magentaBright ${readyString}}`);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMvcmVhZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFO0lBRXhCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFL0IsTUFBTSxTQUFTLEdBQUcsR0FBRyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDO0lBRWpFLElBQUksU0FBUyxHQUFHLEdBQUcsU0FBUyxpQkFBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUNoRSxJQUFJLFdBQVcsR0FBRyxHQUFHLFNBQVMsYUFBYSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksY0FBYyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksNkJBQTZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLENBQUM7SUFFdkosT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUEsa0JBQWtCLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDakQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUEsa0JBQWtCLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFFdkQsQ0FBQyxDQUFBIn0=
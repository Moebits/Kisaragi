module.exports = (client) => {
    const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
    var logString = `${timestamp} Logged in as ${client.user.tag}!`;
    var readyString = `${timestamp} Ready in ${client.guilds.size} guilds on ${client.channels.size} channels, for a total of ${client.users.size} users.`;
    console.log(chalk `{magentaBright ${logString}}`);
    console.log(chalk `{magentaBright ${readyString}}`);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhZHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9ldmVudHMvcmVhZHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFO0lBRXhCLE1BQU0sU0FBUyxHQUFHLEdBQUcsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQztJQUVqRSxJQUFJLFNBQVMsR0FBRyxHQUFHLFNBQVMsaUJBQWlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDaEUsSUFBSSxXQUFXLEdBQUcsR0FBRyxTQUFTLGFBQWEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLGNBQWMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLDZCQUE2QixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDO0lBRXZKLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFBLGtCQUFrQixXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBRXZELENBQUMsQ0FBQSJ9
module.exports = (client: any, message: any) => {

    let chalk: any = require("chalk");
    let moment: any = require("moment");

    const timestamp: string = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;

    let logString: string = `${timestamp} Logged in as ${client.user.tag}!`;
    let readyString: string = `${timestamp} Ready in ${client.guilds.size} guilds on ${client.channels.size} channels, for a total of ${client.users.size} users.`;

    console.log(chalk`{magentaBright ${logString}}`);
    console.log(chalk`{magentaBright ${readyString}}`);

}
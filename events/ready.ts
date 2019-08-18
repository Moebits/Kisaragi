module.exports = (discord: any, message: any) => {

    let chalk: any = require("chalk");
    let moment: any = require("moment");

    const timestamp: string = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;

    let logString: string = `${timestamp} Logged in as ${discord.user.tag}!`;
    let readyString: string = `${timestamp} Ready in ${discord.guilds.size} guilds on ${discord.channels.size} channels, for a total of ${discord.users.size} users.`;

    console.log(chalk`{magentaBright ${logString}}`);
    console.log(chalk`{magentaBright ${readyString}}`);

}
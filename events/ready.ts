module.exports = (client) => {

    let chalk = require("chalk");
    let moment = require("moment");

    const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;

    var logString = `${timestamp} Logged in as ${client.user.tag}!`;
    var readyString = `${timestamp} Ready in ${client.guilds.size} guilds on ${client.channels.size} channels, for a total of ${client.users.size} users.`;

    console.log(chalk`{magentaBright ${logString}}`);
    console.log(chalk`{magentaBright ${readyString}}`);

}
const returnLog = (content: string, type: string, color: string) => {
  let chalk = require("chalk");
  let moment = require("moment");
  const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
  let logString = `${timestamp} ${type} ${content}`;
  return console.log(chalk`{${color} ${logString}}`);
}

const getLogColor = (logType: string) => {
  switch (logType) {
    case "log": return "magentaBright";
    case "warn": return "yellowBright";
    case "error": return "redBright";
    case "debug": return "greenBright";
    case "cmd": return "blueBright";
    case "ready": return "cyanBright";
  }
}

const switchType = (logType: string) => {
  exports[`${logType}`] = (content: string, type: string = logType) => {
    returnLog(content, type, getLogColor(type));
  }
}

switchType("log");
switchType("error");
switchType("warn");
switchType("debug");
switchType("cmd");

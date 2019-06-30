const chalk = require("chalk");
const moment = require("moment");

function returnLog (content, type, color) {
  const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
  var logString = `${timestamp} ${type} ${content}`;
  return console.log(chalk`{${color} ${logString}}`);
}

function getlogColor (logType) {
  switch (logType) {
    case "log": return "magentaBright";
    case "warn": return "yellowBright";
    case "error": return "redBright";
    case "debug": return "greenBright";
    case "cmd": return "blueBright";
    case "ready": return "cyanBright";
  }
}

exports.log = (content, type = "log") => {

  returnLog(content, type, getlogColor(type));

}

exports.error = (...args) => this.log(...args, "error");
exports.warn = (...args) => this.log(...args, "warn");
exports.debug = (...args) => this.log(...args, "debug");
exports.cmd = (...args) => this.log(...args, "cmd");

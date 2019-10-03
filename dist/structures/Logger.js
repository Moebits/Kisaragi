"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class Logger {
}
exports.Logger = Logger;
Logger.returnLog = (content, type, color) => {
    const timestamp = `${moment_1.default().format("MM DD YYYY hh:mm:ss")} ->`;
    const logString = `${timestamp} ${type} ${content}`;
    return console.log(chalk_1.default `{${color} ${logString}}`);
};
Logger.getLogColor = (logType) => {
    switch (logType) {
        case "log": return "magentaBright";
        case "warn": return "yellowBright";
        case "error": return "redBright";
        case "debug": return "greenBright";
        case "cmd": return "blueBright";
        case "ready": return "cyanBright";
        default: return "magentaBright";
    }
};
Logger.switchType = (type, content) => {
    Logger.returnLog(content, type, Logger.getLogColor(type));
};
Logger.log = (content) => {
    return Logger.switchType("log", content);
};
Logger.error = (content) => {
    return Logger.switchType("error", content);
};
Logger.warn = (content) => {
    return Logger.switchType("warn", content);
};
Logger.debug = (content) => {
    return Logger.switchType("debug", content);
};
Logger.cmd = (content) => {
    return Logger.switchType("cmd", content);
};
//# sourceMappingURL=Logger.js.map
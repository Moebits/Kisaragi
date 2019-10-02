"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
class Ready {
    constructor(discord) {
        this.discord = discord;
        this.run = () => {
            const timestamp = `${moment_1.default().format("MM DD YYYY hh:mm:ss")} ->`;
            const logString = `${timestamp} Logged in as ${this.discord.user.tag}!`;
            const readyString = `${timestamp} Ready in ${this.discord.guilds.size} guilds on ${this.discord.channels.size} channels, for a total of ${this.discord.users.size} users.`;
            console.log(chalk_1.default `{magentaBright ${logString}}`);
            console.log(chalk_1.default `{magentaBright ${readyString}}`);
        };
    }
}
exports.default = Ready;
//# sourceMappingURL=ready.js.map
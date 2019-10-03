"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SQLQuery_1 = require("./SQLQuery");
const noCmdCool = new Set();
class CommandFunctions {
    constructor(discord) {
        this.discord = discord;
        // Run Command
        this.runCommand = (message, args) => __awaiter(this, void 0, void 0, function* () {
            args = args.filter(Boolean);
            const path = yield this.findCommand(args[0]);
            if (!path)
                return this.noCommand(message, args[0]);
            const cp = require(`${path}`);
            yield cp.run(this.discord, message, args).catch((err) => { if (message)
                message.channel.send(this.discord.cmdError(err)); });
        });
        // Auto Command
        this.autoCommand = (message) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            const command = yield sql.fetchColumn("auto", "command");
            const channel = yield sql.fetchColumn("auto", "channel");
            const frequency = yield sql.fetchColumn("auto", "frequency");
            const toggle = yield sql.fetchColumn("auto", "toggle");
            if (!command)
                return;
            for (let i = 0; i < command.length; i++) {
                if (toggle[0][i] === "inactive")
                    continue;
                const guildChannel = (message.guild.channels.find((c) => c.id === channel[i]));
                const cmd = command[i].split(" ");
                const timeout = Number(frequency[i]) * 3600000;
                const rawTimeLeft = yield sql.fetchColumn("auto", "timeout");
                let timeLeft = 0;
                if (rawTimeLeft[0]) {
                    if (rawTimeLeft[i]) {
                        const remaining = (Date.now() - Number(rawTimeLeft[i])) || 0;
                        timeLeft = remaining > timeout ? timeout - (remaining % timeout) : timeout - remaining;
                    }
                    else {
                        rawTimeLeft[i] = Date.now().toString();
                        yield sql.updateColumn("auto", "timeout", rawTimeLeft);
                        timeLeft = 0;
                    }
                }
                else {
                    const timeoutArray = [];
                    timeoutArray.push(Date.now());
                    yield sql.updateColumn("auto", "timeout", timeoutArray);
                    timeLeft = 0;
                }
                const guildMsg = yield guildChannel.messages.fetch({ limit: 1 }).then((m) => m.first());
                if (guildMsg && guildMsg.author)
                    guildMsg.author.id = this.discord.user.id;
                setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.runCommand(message, cmd);
                    timeLeft = timeout;
                }), timeLeft > 0 ? timeLeft : timeout);
            }
        });
        this.noCommand = (message, input) => __awaiter(this, void 0, void 0, function* () {
            const sql = new SQLQuery_1.SQLQuery(message);
            if (noCmdCool.has(message.guild.id))
                return;
            const commands = yield sql.fetchColumn("commands", "command");
            for (let i = 0; i < commands.length; i++) {
                if (commands[i].includes(input)) {
                    noCmdCool.add(message.guild.id);
                    setTimeout(() => { noCmdCool.delete(message.guild.id); }, 100000);
                    return message.reply(`This is not a command! Did you mean **${commands[i]}**?`);
                }
            }
            noCmdCool.add(message.guild.id);
            setTimeout(() => { noCmdCool.delete(message.guild.id); }, 100000);
            return message.reply(`This is not a command, type **help** for help!`);
        });
        this.findCommand = (cmd) => __awaiter(this, void 0, void 0, function* () {
            const commands = require("../commands.json");
            let path = yield SQLQuery_1.SQLQuery.fetchCommand(cmd, "path");
            if1: if (!path) {
                for (const i in commands) {
                    for (const j in commands[i].aliases) {
                        if (commands[i].aliases[j] === cmd) {
                            cmd = commands[i].name;
                            path = yield SQLQuery_1.SQLQuery.fetchCommand(cmd, "path");
                            break if1;
                        }
                    }
                }
            }
            if (!path) {
                return false;
            }
            else {
                return path[0];
            }
        });
    }
}
exports.CommandFunctions = CommandFunctions;
//# sourceMappingURL=CommandFunctions.js.map
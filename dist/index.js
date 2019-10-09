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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const Kisaragi_1 = require("./structures/Kisaragi");
const Logger_1 = require("./structures/Logger");
const SQLQuery_1 = require("./structures/SQLQuery");
const discord = new Kisaragi_1.Kisaragi({
    disableEveryone: true,
    restTimeOffset: 100,
    disabledEvents: ["TYPING_START", "TYPING_STOP"]
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    const cmdFiles = [];
    const subDirectory = fs.readdirSync("./commands/");
    for (let i = 0; i < subDirectory.length; i++) {
        const currDir = subDirectory[i];
        const addFiles = fs.readdirSync(`./commands/${currDir}`);
        if (addFiles !== null)
            cmdFiles.push(addFiles);
        yield Promise.all(addFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            if (!file.endsWith(".ts") && !file.endsWith(".js"))
                return;
            const path = `../commands/${currDir}/${file}`;
            const commandName = file.split(".")[0];
            if (commandName === "empty" || commandName === "tempCodeRunnerFile")
                return;
            const cmdFind = yield SQLQuery_1.SQLQuery.fetchCommand(commandName, "command");
            const command = new (require(`./commands/${currDir}/${file}`).default)(discord);
            if (!cmdFind) {
                yield SQLQuery_1.SQLQuery.insertCommand(commandName, command.aliases, path, command.cooldown);
            }
            else {
                yield SQLQuery_1.SQLQuery.updateCommand(commandName, command.aliases, command.cooldown);
            }
            Logger_1.Logger.log(`Loading Command: ${commandName}`);
        })));
    }
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const evtFiles = fs.readdirSync("./events/");
        evtFiles.forEach((file) => {
            if (!file.endsWith(".ts") && !file.endsWith(".js"))
                return;
            const eventName = file.split(".")[0];
            Logger_1.Logger.log(`Loading Event: ${eventName}`);
            const event = new (require(`./events/${eventName}.js`).default)(discord);
            discord.on(eventName, (...args) => event.run(...args));
        });
        Logger_1.Logger.log(`Loaded a total of ${cmdFiles.length} commands.`);
        Logger_1.Logger.log(`Loaded a total of ${evtFiles.length} events.`);
        yield discord.login(process.env.TOKEN);
    }), 1000);
});
start();
process.on("unhandledRejection", (err) => {
    console.error("Uncaught Promise Error: ", err);
});
//# sourceMappingURL=index.js.map
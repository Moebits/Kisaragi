var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
const token = process.env.TOKEN;
const ownerID = process.env.OWNER_ID;
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
const prefix = config.prefix;
const colors = config.colors;
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
client.logger = require("./modules/logger.js");
const Enmap = require("enmap");
client.commands = new Enmap();
client.aliases = new Enmap();
const SQLite = require("better-sqlite3");
client.scores = new SQLite('../data/scores.sqlite');
client.settings = new SQLite('../data/settings.sqlite');
var version = "1.0.0";
const defaultSettings = {
    prefix: "=>",
    modLogChannel: "mod-log",
    messageLogChannel: "message-log",
    userLogChannel: "user-log",
    guildLogChannel: "guild-log",
    clientLogChannel: "client-log",
    welcomeChannel: "welcome",
    welcomeMessage: "Welcome to {{guild}}, {{user}}!",
    leaveChannel: "leave",
    leaveMessage: "{{user}} has left {{guild}}!",
    starboardChannel: "starboard",
    pinboardChannel: "pinboard",
    modRole: "Moderator",
    adminRole: "Administrator",
    muteRole: "muted",
    verifyRole: "verified",
    restrictRole: "restricted",
    timezone: "GMT -4",
    levelToggle: "true"
};
const subDirectory = [
    "administrator",
    "anime",
    "bot owner",
    "configuration",
    "geometry dash",
    "heart",
    "hentai",
    "info",
    "level",
    "logging",
    "moderator",
    "music",
    "osu",
    "role",
    "utility"
];
const init = () => __awaiter(this, void 0, void 0, function* () {
    var cmdFiles = new Array();
    var addFiles = new Array();
    for (var i in subDirectory) {
        var currDir = subDirectory[i];
        addFiles = yield readdir(`./commands/${currDir}`);
        if (addFiles !== null) {
            cmdFiles.push(addFiles);
        }
        addFiles.forEach(file => {
            if (!file.endsWith(".js"))
                return;
            let findFile = require(`./commands/${currDir}/${file}`);
            let commandName = file.split(".")[0];
            client.logger.log(`Loading Command: ${commandName}`);
            client.commands.set(commandName, findFile);
        });
    }
    var evtFiles = yield readdir("./events/");
    evtFiles.forEach(file => {
        if (!file.endsWith(".js"))
            return;
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client));
    });
    client.logger.log(`Loaded a total of ${cmdFiles.length} commands.`);
    client.logger.log(`Loaded a total of ${evtFiles.length} events.`);
    client.login(token);
});
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNoQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNyQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFcEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBRTdCLE1BQU0sRUFBQyxTQUFTLEVBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqRCxNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBRS9DLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDOUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBRTdCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ3pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FB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
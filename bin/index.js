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
var version = "1.0.0";
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
client.logger = require("./modules/logger.js");
require("./modules/misc-functions.js")(client);
const Enmap = require("enmap");
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({ name: "settings" });
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
    client.commands = new Enmap();
    for (var i in subDirectory) {
        var currDir = subDirectory[i];
        addFiles = yield readdir(`./commands/${currDir}`);
        if (addFiles !== null) {
            cmdFiles.push(addFiles);
        }
        addFiles.forEach(file => {
            if (!file.endsWith(".js"))
                return;
            let props = require(`./commands/${currDir}/${file}`);
            let commandName = file.split(".")[0];
            client.logger.log(`Loading Command: ${commandName}`);
            client.commands.set(commandName, props);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMzQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNoQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUNyQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDcEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDekMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBRTdCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUV0QixNQUFNLEVBQUMsU0FBUyxFQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFFakQsTUFBTSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUMvQyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUUvQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUM3QixNQUFNLENBQUMsUUFBUSxHQUFH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
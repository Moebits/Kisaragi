"use strict";
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
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
let version = "1.0.0";
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
const start = () => __awaiter(this, void 0, void 0, function* () {
    client.logger = require("./exports/logger.js");
    require('./exports/queries.js')(client);
    try {
        let cmdFiles = [];
        for (let i in subDirectory) {
            let currDir = subDirectory[i];
            let addFiles = yield readdir(`./commands/${currDir}`);
            if (addFiles !== null) {
                cmdFiles.push(addFiles);
            }
            addFiles.forEach((file) => {
                if (!file.endsWith(".js"))
                    return;
                //let findFile = require(`./commands/${currDir}/${file}`);
                let commandName = file.split(".")[0];
                client.logger.log(`Loading Command: ${commandName}`);
                if (client.fetchCommand(commandName) !== commandName) {
                    client.insertInto(`"commands", "command", ${commandName}`);
                }
            });
        }
        let evtFiles = yield readdir("./events/");
        evtFiles.forEach((file) => {
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
    }
    catch (error) {
        console.log(error);
    }
});
start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDM0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDaEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDckMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3BDLE1BQU0sRUFBQyxTQUFTLEVBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUVqRCxJQUFJLE9BQU8sR0FBVyxPQUFPLENBQUM7QUFFOUIsTUFBTSxZQUFZLEdBQWE7SUFDM0IsZUFBZTtJQUNmLE9BQU87SUFDUCxXQUFXO0lBQ1gsZUFBZTtJQUNmLGVBQWU7SUFDZixPQUFPO0lBQ1AsUUFBUTtJQUNSLE1BQU07SUFDTixPQUFPO0lBQ1AsU0FBUztJQUNULFdBQVc7SUFDWCxPQUFPO0lBQ1AsS0FBSztJQUNMLE1BQU07SUFDTixTQUFTO0NBQ1osQ0FBQztBQUVGLE1BQU0sS0FBSyxHQUFHLEdBQVMsRUFBRTtJQUVyQixNQUFNLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBQy9DLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXhDLElBQUk7UUFDQSxJQUFJLFFBQVEsR0FBYSxFQUFFLENBQUM7UUFFNUIsS0FBSyxJQUFJLENBQUMsSUFBSSxZQUFZLEVBQUU7WUFDeEIsSUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksUUFBUSxHQUFHLE1BQU0sT0FBTyxDQUFDLGNBQWMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUN0RCxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQ25CLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDM0I7WUFDRCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztvQkFBRSxPQUFPO2dCQUNsQywwREFBMEQ7Z0JBQzFELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG9CQUFvQixXQUFXLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRCxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLEtBQUssV0FBVyxFQUFFO29CQUNsRCxNQUFNLENBQUMsVUFBVSxDQUFDLDBCQUEwQixXQUFXLEVBQUUsQ0FBQyxDQUFDO2lCQUM5RDtZQUNMLENBQUMsQ0FBQyxDQUFDO1NBQ047UUFFRCxJQUFJLFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUxQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUFFLE9BQU87WUFDbEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUNqRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsUUFBUSxDQUFDLE1BQU0sWUFBWSxDQUFDLENBQUM7UUFDcEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQXFCLFFBQVEsQ0FBQyxNQUFNLFVBQVUsQ0FBQyxDQUFDO1FBRWxFLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FFbkI7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEI7QUFDVCxDQUFDLENBQUEsQ0FBQTtBQUVELEtBQUssRUFBRSxDQUFDIn0=
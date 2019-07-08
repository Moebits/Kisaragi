require('dotenv').config();
const token = process.env.TOKEN;
const ownerID = process.env.OWNER_ID;
const Discord = require("discord.js");
const client = new Discord.Client(); 
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);

let version: string = "1.0.0";

const subDirectory: string[] = [
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

const commandAliases: any = {
    "create guild": [],
    "eval": [],
    "reboot": [],
    "reload": [],
    "set": [],
    "avatar": [],
    "emoji": [],
    "guild": [],
    "help": [],
    "ping": [],
    "prefix": [],
    "give": [],
    "rank": [],
    "top": [],
    "del": [],
    "role": [],
    "remdash": []
}

const start = async () => {

    client.logger = require("./exports/logger.js");
    require('./exports/queries.js')(client);

    try {
        let cmdFiles: string[] = [];

        for (let i in subDirectory) {
            let currDir = subDirectory[i];
            let addFiles = await readdir(`./commands/${currDir}`);
            if (addFiles !== null) {
                cmdFiles.push(addFiles);
            }
            addFiles.forEach((file: any) => {
                if (!file.endsWith(".js")) return;
                let path = `./commands/${currDir}/${file}`;
                let commandName = file.split(".")[0];
                client.logger.log(`Loading Command: ${commandName}`);
                if (client.fetchCommand(commandName, "command") === null || undefined) {
                    client.insertCommand(commandName, commandAliases[commandName], path);
                }
                client.updateAliases(commandName, commandAliases[commandName]);
            });      
        }

        let evtFiles = await readdir("./events/");

        evtFiles.forEach((file: any) => {
            if (!file.endsWith(".js")) return;
            const eventName = file.split(".")[0];
            client.logger.log(`Loading Event: ${eventName}`);
            const event = require(`./events/${file}`);
            client.on(eventName, event.bind(null, client));
        });

        client.logger.log(`Loaded a total of ${cmdFiles.length} commands.`);
        client.logger.log(`Loaded a total of ${evtFiles.length} events.`);

        client.login(token);

        } catch (error) {
            console.log(error);
        }
}

start();

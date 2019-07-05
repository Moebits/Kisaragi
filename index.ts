require('dotenv').config();
const token = process.env.TOKEN;
const ownerID = process.env.OWNER_ID;
const Discord = require("discord.js");
const client = new Discord.Client(); 
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);
client.logger = require("./modules/logger.js");
const config = require("../config.json");
const prefix = config.prefix;
const colors = config.colors;

let version: string = "1.0.0";

const defaultSettings: object = {
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
    muteRole: "muted",
    verifyRole: "verified",
    restrictRole: "restricted",
    timezone: "GMT -4",
    levelToggle: "true"
  }

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

const start = async () => {

    try {
        let cmdFiles: string[] = [];

        for (let i in subDirectory) {
            let currDir = subDirectory[i];
            let addFiles = await readdir(`./commands/${currDir}`);
            if (addFiles !== null) {
                cmdFiles.push(addFiles);
            }
            addFiles.forEach(file => {
                if (!file.endsWith(".js")) return;
                let findFile = require(`./commands/${currDir}/${file}`);
                let commandName = file.split(".")[0];
                client.logger.log(`Loading Command: ${commandName}`);
                client.commands.set(commandName, findFile);
            });      
        }

        let evtFiles = await readdir("./events/");

        evtFiles.forEach(file => {
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

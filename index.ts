require('../dotenv').config();
const token = process.env.TOKEN;
const ownerID = process.env.OWNER_ID;
const Discord = require("discord.js");
const client = new Discord.Client(); 
const config = require("../config.json");
const prefix = config.prefix;
const colors = config.colors;

var version = "1.0.0";

const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);

client.logger = require("./modules/logger.js");
require("./modules/misc-functions.js")(client);

const Enmap = require("enmap");
client.commands = new Enmap();
client.aliases = new Enmap();
client.settings = new Enmap({name: "settings"});



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

const init = async () => {


    var cmdFiles = new Array();
    var addFiles = new Array();
    client.commands = new Enmap();

    for (var i in subDirectory) {
        var currDir = subDirectory[i];
            addFiles = await readdir(`./commands/${currDir}`);
            if (addFiles !== null) {
                cmdFiles.push(addFiles);
            }
            addFiles.forEach(file => {
                if (!file.endsWith(".js")) return;
                let props = require(`./commands/${currDir}/${file}`);
                let commandName = file.split(".")[0];
                client.logger.log(`Loading Command: ${commandName}`);
                client.commands.set(commandName, props);
            })      
        }

    var evtFiles = await readdir("./events/");

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
  
}

init();

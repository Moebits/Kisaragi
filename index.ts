const token = process.env.TOKEN;
const {promisify} = require("util");
const readdir = promisify(require("fs").readdir);

const Discord = require("discord.js");
const client = new Discord.Client({
    apiRequestMethod: "sequential",
    disableEveryone: true,
    restTimeOffset: 0,
    disabledEvents: ["TYPING_START", "TYPING_STOP"]
});

const commands = require("../commands.json");

//let version: string = "1.0.0"

const start = async () => {

    const logger = require("./exports/logger.js");
    require('./exports/queries.js')(client, null);
    require('./exports/functions.js')(client, null);

    let cmdFiles: any = [];
    const subDirectory = await readdir("./commands/");

    for (let i in subDirectory) {
        let currDir = subDirectory[i];
        let addFiles = await readdir(`./commands/${currDir}`);
        if (addFiles !== null) {
            cmdFiles.push(addFiles);
        }
        await Promise.all(addFiles.map(async (file: any) => {
            if (!file.endsWith(".js")) return;
            let path = `../commands/${currDir}/${file}`;
            let commandName = file.split(".")[0];
            let cmdFind = await client.fetchCommand(commandName, "command");
            if1:
            if (!cmdFind) {
                if (commandName === "empty" || commandName === "tempCodeRunnerFile") break if1;
                if (!commands[commandName]) {
                    console.log(`${commandName} not found`); 
                    break if1;
                }
                await client.insertCommand(commandName, commands[commandName].aliases, path, commands[commandName].cooldown);
            } else {
                if (commandName === "empty" || commandName === "tempCodeRunnerFile") break if1;
                if (!commands[commandName]) {
                    console.log(`${commandName} not found`); 
                    break if1;
                }
                await client.updateCommand(commandName, commands[commandName].aliases, commands[commandName].cooldown);
            }
            logger.log(`Loading Command: ${commandName}`);
        }));      
    }

    setTimeout(async () => {
    
        let evtFiles = await readdir("./events/");
    
        evtFiles.forEach((file: any) => {
            if (!file.endsWith(".js")) return;
            const eventName = file.split(".")[0];
            logger.log(`Loading Event: ${eventName}`);
            const event = require(`./events/${file}`);
            client.on(eventName, event.bind(null, client));
        });
    
        logger.log(`Loaded a total of ${cmdFiles.length} commands.`);
        logger.log(`Loaded a total of ${evtFiles.length} events.`);
    
        client.login(token);
 
        //client.generateCommands(cmdFiles)

    }, 1000);
}

start();



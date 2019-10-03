"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Generate {
    constructor(discord) {
        // Generate Commands for commands.json
        this.generateCommands = (cmdFiles) => {
            const newFiles = cmdFiles.flat();
            const addedFiles = [];
            loop1: for (let i = 0; i < newFiles.length; i++) {
                const commandName = newFiles[i].split(".")[0];
                for (let j = 0; j < addedFiles.length; j++) {
                    if (addedFiles[j] === commandName) {
                        continue loop1;
                    }
                }
                addedFiles.push(commandName);
                console.log(`"${commandName}": {"name": "${commandName}", "aliases": [], "cooldown": ""},`);
            }
        };
        // Generate Emojis for config.json
        this.generateEmojis = (letterNames) => {
            for (let i = 0; i < letterNames.length; i++) {
                this.discord.emojis.map((emoji) => {
                    if (emoji.name === letterNames[i]) {
                        console.log(`{"name": "${letterNames[i]}", "id": "${emoji.id}"},`);
                    }
                });
            }
        };
        this.discord = discord;
    }
}
exports.Generate = Generate;
//# sourceMappingURL=Generate.js.map
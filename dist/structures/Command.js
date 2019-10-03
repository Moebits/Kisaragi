"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(discord, { name = "None", category = "Misc", description = "No description provided.", help = "This command is not documented.", example = "There are no examples.", enabled = true, guildOnly = false, aliases = [], cooldown = 3 }) {
        this.discord = discord;
        this.options = { name, category, description, help, example, enabled, guildOnly, aliases, cooldown };
    }
    get help() {
        return this.options;
    }
    get bot() {
        return this.discord;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map
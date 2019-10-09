"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor({ name = "None", category = "Misc", description = "No description provided.", help = "This command is not documented.", examples = "There are no examples.", image = "No image", enabled = true, guildOnly = false, aliases = [], cooldown = 3, permission = "SEND_MESSAGES", botPermission = "SEND_MESSAGES", nsfw = false }) {
        this.options = { name, category, description, help, examples, image, enabled, guildOnly, aliases, cooldown, permission, botPermission, nsfw };
    }
    get help() {
        return this.options;
    }
}
exports.Command = Command;
//# sourceMappingURL=Command.js.map
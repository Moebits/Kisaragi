"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class Give extends Command_1.Command {
    constructor(kisaragi) {
        super(kisaragi, {
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const giveEmbed = embeds.createEmbed();
            console.log(giveEmbed);
        };
    }
}
exports.default = Give;
//# sourceMappingURL=give.js.map
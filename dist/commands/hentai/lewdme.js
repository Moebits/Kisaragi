"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lewdme = __importStar(require("../../assets/links/lewdme.json"));
const Command_1 = require("../../structures/Command");
const Embeds_1 = require("./../../structures/Embeds");
class LewdMe extends Command_1.Command {
    constructor() {
        super({
            aliases: [],
            cooldown: 3
        });
        this.run = (discord, message, args) => {
            const embeds = new Embeds_1.Embeds(discord, message);
            const lewdmeEmbed = embeds.createEmbed();
            const random = Math.floor(Math.random() * (lewdme.pics.length - 1));
            lewdmeEmbed
                .setTitle(`**Lewd Me** ${discord.getEmoji("kisaragibawls")}`)
                .setURL(lewdme.pics[random].source)
                .setImage(lewdme.pics[random].link);
            message.channel.send(lewdmeEmbed);
        };
    }
}
exports.default = LewdMe;
//# sourceMappingURL=lewdme.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Embeds_1 = require("../structures/Embeds");
const Images_1 = require("./../structures/Images");
const SQLQuery_1 = require("./../structures/SQLQuery");
class GuildMemberAdd {
    constructor(discord) {
        this.run = (member) => __awaiter(this, void 0, void 0, function* () {
            const firstMsg = yield this.discord.fetchFirstMessage(member.guild);
            const sql = new SQLQuery_1.SQLQuery(firstMsg);
            const bans = yield member.guild.fetchBans();
            if (bans.has(member.id))
                return;
            let defaultChannel = firstMsg.channel;
            const defChannel = yield sql.fetchColumn("blocks", "default channel");
            if (defChannel.join("")) {
                defaultChannel = this.discord.channels.find((c) => c.id.toString() === defChannel.join(""));
            }
            const defMsg = defaultChannel ? yield defaultChannel.messages.fetch({ limit: 1 }).then((m) => m.first()) :
                yield this.discord.fetchFirstMessage(member.guild);
            const image = new Images_1.Images(this.discord, defMsg);
            const embeds = new Embeds_1.Embeds(this.discord, defMsg);
            function welcomeMessages() {
                return __awaiter(this, void 0, void 0, function* () {
                    const welcomeToggle = yield sql.fetchColumn("welcome leaves", "welcome toggle");
                    if (welcomeToggle.join("") === "off")
                        return;
                    const welcomeMsg = yield sql.fetchColumn("welcome leaves", "welcome message");
                    const welcomeChannel = yield sql.fetchColumn("welcome leaves", "welcome channel");
                    const welcomeImage = yield sql.fetchColumn("welcome leaves", "welcome bg image");
                    const welcomeText = yield sql.fetchColumn("welcome leaves", "welcome bg text");
                    const welcomeColor = yield sql.fetchColumn("welcome leaves", "welcome bg color");
                    const channel = member.guild.channels.find((c) => c.id.toString() === welcomeChannel.join(""));
                    const attachment = yield image.createCanvas(member, welcomeImage[0], welcomeText[0], welcomeColor[0]);
                    const newMsg = welcomeMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
                        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount.toString());
                    channel.send(newMsg, attachment);
                });
            }
            welcomeMessages();
            function avatarBan(discord) {
                return __awaiter(this, void 0, void 0, function* () {
                    const banToggle = yield sql.fetchColumn("blocks", "leaver ban toggle");
                    const banEmbed = embeds.createEmbed();
                    if (banToggle.join("") === "off")
                        return;
                    if (!member.user.avatarURL) {
                        const channel = defaultChannel;
                        const reason = "Has the default discord avatar.";
                        banEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`);
                        if (channel)
                            channel.send(banEmbed);
                        banEmbed
                            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`);
                        const dm = yield member.user.createDM();
                        try {
                            yield dm.send(banEmbed);
                        }
                        catch (err) {
                            console.log(err);
                        }
                        yield member.ban({ reason });
                    }
                });
            }
            avatarBan(this.discord);
        });
        this.discord = discord;
    }
}
exports.default = GuildMemberAdd;
//# sourceMappingURL=guildMemberAdd.js.map
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
const Embeds_1 = require("./../structures/Embeds");
const Images_1 = require("./../structures/Images");
const SQLQuery_1 = require("./../structures/SQLQuery");
class GuildMemberRemove {
    constructor(discord) {
        this.discord = discord;
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
            function leaveMessages() {
                return __awaiter(this, void 0, void 0, function* () {
                    const leaveToggle = yield sql.fetchColumn("welcome leaves", "leave toggle");
                    if (leaveToggle.join("") === "off")
                        return;
                    const leaveMsg = yield sql.fetchColumn("welcome leaves", "leave message");
                    const leaveChannel = yield sql.fetchColumn("welcome leaves", "leave channel");
                    const leaveImage = yield sql.fetchColumn("welcome leaves", "leave bg image");
                    const leaveText = yield sql.fetchColumn("welcome leaves", "leave bg text");
                    const leaveColor = yield sql.fetchColumn("welcome leaves", "leave bg color");
                    const channel = member.guild.channels.find((c) => c.id.toString() === leaveChannel.join(""));
                    const attachment = yield image.createCanvas(member, leaveImage[0], leaveText[0], leaveColor[0]);
                    const newMsg = leaveMsg.join("").replace(/user/g, `<@${member.user.id}>`).replace(/guild/g, member.guild.name)
                        .replace(/tag/g, member.user.tag).replace(/name/g, member.displayName).replace(/count/g, member.guild.memberCount.toString());
                    channel.send(newMsg, attachment);
                });
            }
            leaveMessages();
            function leaveBan(discord) {
                return __awaiter(this, void 0, void 0, function* () {
                    const leaveToggle = yield sql.fetchColumn("blocks", "leaver ban toggle");
                    const banEmbed = embeds.createEmbed();
                    if (leaveToggle.join("") === "off")
                        return;
                    const now = Math.ceil(Date.now());
                    const joinDate = member.joinedTimestamp;
                    if ((now - joinDate) <= 300000) {
                        const channel = defaultChannel;
                        const reason = "Joining and leaving in under 5 minutes.";
                        banEmbed
                            .setAuthor("ban", "https://discordemoji.com/assets/emoji/bancat.png")
                            .setTitle(`**Member Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_Successfully banned <@${member.user.id}> for reason:_ **${reason}**`);
                        if (channel)
                            channel.send(banEmbed);
                        banEmbed
                            .setTitle(`**You Were Banned** ${discord.getEmoji("kannaFU")}`)
                            .setDescription(`${discord.getEmoji("star")}_You were banned from ${member.guild.name} for reason:_ **${reason}**`);
                        yield member.ban({ reason });
                    }
                });
            }
            leaveBan(this.discord);
        });
    }
}
exports.default = GuildMemberRemove;
//# sourceMappingURL=guildMemberRemove.js.map
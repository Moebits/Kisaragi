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
const SQLQuery_1 = require("./SQLQuery");
class Settings {
    constructor(message) {
        this.message = message;
        this.sql = new SQLQuery_1.SQLQuery(this.message);
        this.guildSettings = {
            "name": this.message.guild.name,
            "guild id": this.message.guild.id,
            "members": this.message.guild.memberCount
        };
        this.prefixSetting = {
            prefix: "=>"
        };
        this.timezoneSetting = {
            timezone: "GMT -4"
        };
        this.guildInfoSettings = {
            "created": this.message.guild.createdTimestamp,
            "joined": this.message.guild.joinedTimestamp,
            "icon": this.message.guild.iconURL,
            "splash": this.message.guild.splashURL,
            "region": this.message.guild.region,
            "owner": this.message.guild.owner.user.tag,
            "owner id": this.message.guild.ownerID,
            "games": this.message.guild.presences.map((presence) => presence.activity !== null ? presence.activity.name : null)
        };
        this.userSettings = {
            "user list": this.message.guild.members.map((member) => member.displayName),
            "user id list": this.message.guild.members.map((member) => member.id),
            "user join list": this.message.guild.members.map((member) => member.joinedTimestamp)
        };
        this.channelSettings = {
            "channel list": this.message.guild.channels.map((channel) => channel.name),
            "channel id list": this.message.guild.channels.map((channel) => channel.id),
            "channel created list": this.message.guild.channels.map((channel) => channel.createdTimestamp),
            "category list": this.message.guild.channels.map((channel) => channel.parent !== null ? channel.parent.name : null),
            "category id list": this.message.guild.channels.map((channel) => channel.parent !== null ? channel.parentID : null)
        };
        this.roleSettings = {
            "role list": this.message.guild.roles.map((role) => role.name),
            "role id list": this.message.guild.roles.map((role) => role.id),
            "role created list": this.message.guild.roles.map((role) => role.createdTimestamp),
            "role color list": this.message.guild.roles.map((role) => role.hexColor)
        };
        this.emojiSettings = {
            "emoji list": this.message.guild.emojis.map((emoji) => emoji.name),
            "emoji id list": this.message.guild.emojis.map((emoji) => emoji.id),
            "emoji created list": this.message.guild.emojis.map((emoji) => emoji.createdTimestamp),
            "emoji identifier list": this.message.guild.emojis.map((emoji) => emoji.identifier)
        };
        this.logSettings = {
            "mod log": null,
            "this.message log": null,
            "user log": null,
            "guild log": null,
            "discord log": null
        };
        this.specialChannelSettings = {
            "star channel": null,
            "star threshold": 3,
            "pin channel": null
        };
        this.specialRoleSettings = {
            "mute role": null,
            "restricted role": null,
            "warn one": null,
            "warn two": null,
            "mod role": null,
            "admin role": null,
            "self roles": null,
            "reaction roles": null
        };
        this.pointSettings = {
            "score list": null,
            "level list": null,
            "point range": [10, 20],
            "point threshold": 1000,
            "level this.message": "Congrats user, you are now level newlevel!",
            "point timeout": 60000,
            "point toggle": "off"
        };
        this.welcomeLeaveSettings = {
            "welcome channel": null,
            "welcome this.message": "Welcome to guild, user!",
            "welcome toggle": "off",
            "leave channel": null,
            "leave this.message": "user has left guild!",
            "leave toggle": "off",
            "welcome bg image": "https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif",
            "welcome bg text": "Welcome tag! There are now count members.",
            "welcome bg color": "rainbow",
            "leave bg image": "https://data.whicdn.com/images/210153523/original.gif",
            "leave bg text": "tag left! There are now count members.",
            "leave bg color": "rainbow"
        };
        this.birthdaySettings = {
            "birthday user id": null,
            "birthday date": null,
            "birthday channel": null,
            "birthday this.message": "Happy birthday to {{user}}!",
            "birthday toggle": "off"
        };
        this.imageSettings = {
            "image channels": null,
            "dropbox folders": null,
            "google albums": null,
            "notify toggle": "on"
        };
        this.warnSettings = {
            "warn log": null,
            "warn penalty": "none",
            "warn threshold": 3
        };
        this.blockSettings = {
            "blocked words": null,
            "disabled commands": null,
            "pfp ban toggle": "off",
            "leaver ban toggle": "off",
            "ascii name toggle": "off",
            "default channel": null,
            "block match": "partial",
            "block toggle": "off",
            "asterisk": "off"
        };
        this.captchaSettings = {
            "verify toggle": "off",
            "verify role": null,
            "captcha type": "text",
            "captcha color": "#ffffff",
            "difficulty": "medium"
        };
        this.autoSettings = {
            command: null,
            channel: null,
            frequency: null,
            toggle: null,
            timeout: null
        };
        this.linkSettings = {
            text: null,
            voice: null,
            toggle: null
        };
        this.detectionSettings = {
            links: "on",
            anime: "off",
            pfp: "off",
            weeb: null,
            normie: null,
            ignored: null
        };
        this.reactionSettings = {
            "this.message": null,
            "emoji": null,
            "role": null,
            "state": null
        };
        this.tableMap = {
            "prefixes": this.prefixSetting,
            "timezones": this.timezoneSetting,
            "guilds": this.guildSettings,
            "guild info": this.guildInfoSettings,
            "users": this.userSettings,
            "channels": this.channelSettings,
            "roles": this.roleSettings,
            "emojis": this.emojiSettings,
            "logs": this.logSettings,
            "special channels": this.specialChannelSettings,
            "special roles": this.specialRoleSettings,
            "points": this.pointSettings,
            "welcome leaves": this.welcomeLeaveSettings,
            "birthdays": this.birthdaySettings,
            "images": this.imageSettings,
            "warns": this.warnSettings,
            "blocks": this.blockSettings,
            "captcha": this.captchaSettings,
            "auto": this.autoSettings,
            "links": this.linkSettings,
            "detection": this.detectionSettings,
            "reaction": this.reactionSettings
        };
        // Initialize all tables
        this.initAll = () => __awaiter(this, void 0, void 0, function* () {
            const entries = Object.entries(this.tableMap);
            for (const [table, object] of entries) {
                const settings = Object.entries(object);
                for (const [key, value] of settings) {
                    yield this.sql.updateColumn(table, key, value);
                }
            }
            return;
        });
    }
}
exports.Settings = Settings;
//# sourceMappingURL=Settings.js.map
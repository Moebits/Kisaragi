import {GuildChannel, GuildEmoji, GuildMember, Message, Presence, Role} from "discord.js"
import {SQLQuery} from "./SQLQuery"

interface Init {
    [propName: string]: unknown
}

export class Settings {
    private readonly sql = new SQLQuery(this.message)

    constructor(private readonly message: Message) {}

    private readonly guildSettings: Init = {
        "name": this.message.guild!.name,
        "guild id": this.message.guild!.id,
        "members": this.message.guild!.memberCount
    }

    private readonly prefixSetting: Init = {
        prefix: "=>"
      }

    private readonly timezoneSetting: Init = {
        timezone: "GMT -4"
    }

    private readonly guildInfoSettings: Init = {
        "created": this.message.guild!.createdTimestamp,
        "joined": this.message.guild!.joinedTimestamp,
        "icon": this.message.guild!.iconURL,
        "splash": this.message.guild!.splashURL,
        "region": this.message.guild!.region,
        "owner": this.message.guild!.owner!.user.tag,
        "owner id": this.message.guild!.ownerID,
        "games": this.message.guild!.presences.cache.map((presence: Presence) => presence.activities.join("") ? presence.activities.map((a) => a?.name) : [null]).flat(Infinity)
    }

    private readonly userSettings: Init = {
        "user list": this.message.guild!.members.cache.map((member: GuildMember) => member.displayName),
        "user id list": this.message.guild!.members.cache.map((member: GuildMember) => member.id),
        "user join list": this.message.guild!.members.cache.map((member: GuildMember) => member.joinedTimestamp)
    }

    private readonly channelSettings: Init = {
        "channel list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.name),
        "channel id list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.id),
        "channel created list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.createdTimestamp),
        "category list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.parent ? channel.parent.name : null),
        "category id list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.parentID ? channel.parentID : null)
    }

    private readonly roleSettings: Init = {
        "role list": this.message.guild!.roles.cache.map((role: Role) => role.name),
        "role id list": this.message.guild!.roles.cache.map((role: Role) => role.id),
        "role created list": this.message.guild!.roles.cache.map((role: Role) => role.createdTimestamp),
        "role color list": this.message.guild!.roles.cache.map((role: Role) => role.hexColor)
    }

    private readonly emojiSettings: Init = {
        "emoji list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.name),
        "emoji id list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.id),
        "emoji created list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.createdTimestamp),
        "emoji identifier list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.identifier)
    }

    private readonly logSettings: Init = {
        "mod log": null,
        "message log": null,
        "user log": null,
        "member log": null
    }

    private readonly specialChannelSettings: Init = {
        "star channel": null,
        "star threshold": 3,
        "pin channel": null
    }

    private readonly specialRoleSettings: Init = {
        "mute role": null,
        "restricted role": null,
        "warn one": null,
        "warn two": null,
        "mod role": null,
        "admin role": null,
        "self roles": null,
        "reaction roles": null
    }

    private readonly pointSettings: Init = {
        "score list": null,
        "level list": null,
        "point range": [10, 20],
        "point threshold": 1000,
        "level message": "Congrats user, you are now level newlevel!",
        "point timeout": 60000,
        "point toggle": "off"
    }

    private readonly welcomeLeaveSettings: Init = {
        "welcome channel": null,
        "welcome message": "Welcome to guild, user!",
        "welcome toggle": "off",
        "leave channel": null,
        "leave message": "user has left guild!",
        "leave toggle": "off",
        "welcome bg image": "https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif",
        "welcome bg text": "Welcome tag! There are now count members.",
        "welcome bg color": "rainbow",
        "leave bg image": "https://data.whicdn.com/images/210153523/original.gif",
        "leave bg text": "tag left! There are now count members.",
        "leave bg color": "rainbow"
    }

    private readonly birthdaySettings: Init = {
        "birthday user list": null,
        "birthday date list": null,
        "birthday channel": null,
        "birthday message": "Happy birthday to user!",
        "birthday toggle": "off"
    }

    private readonly imageSettings: Init = {
        "image channels": null,
        "dropbox folders": null,
        "google albums": null,
        "notify toggle": "on"
    }

    private readonly warnSettings: Init = {
        "warn log": null,
        "warn penalty": "none",
        "warn threshold": 3
    }

    private readonly blockSettings: Init = {
        "blocked words": null,
        "disabled commands": null,
        "pfp ban toggle": "off",
        "leaver ban toggle": "off",
        "ascii name toggle": "off",
        "default channel": null,
        "block match": "partial",
        "block toggle": "off",
        "link ban": "off",
        "asterisk": "off"
    }

    private readonly captchaSettings: Init = {
        "verify toggle": "off",
        "verify role": null,
        "captcha type": "text",
        "captcha color": "#ffffff",
        "difficulty": "medium"
    }

    private readonly autoSettings: Init = {
        command: null,
        channel: null,
        frequency: null,
        toggle: null,
        timeout: null
    }

    private readonly linkSettings: Init = {
        text: null,
        voice: null,
        toggle: null
    }

    private readonly detectionSettings: Init = {
        links: "on",
        anime: "off",
        pfp: "off",
        weeb: null,
        normie: null,
        ignored: null
    }

    private readonly configSettings: Init = {
        "embed colors": "default",
        "permissions": "role"
    }

    private readonly tableMap: object = {
        "guilds": this.guildSettings,
        "users": this.userSettings,
        "prefixes": this.prefixSetting,
        "timezones": this.timezoneSetting,
        "guild info": this.guildInfoSettings,
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
        "config": this.configSettings
    }

    // Initialize all tables
    public initAll = async () => {
        const entries = Object.entries(this.tableMap)
        for (const [table, object] of entries) {
            if (table === "points") {
                const exists = await this.sql.fetchColumn("points", "score list")
                if (exists) continue
            }
            const settings = Object.entries(object)
            for (const [key, value] of settings) {
                await this.sql.updateColumn(table, key, value)
              }
          }
        return
    }
}

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
        ...this.guildSettings,
        prefix: "=>"
      }

    private readonly timezoneSetting: Init = {
        ...this.guildSettings,
        timezone: "GMT -4"
    }

    private readonly guildInfoSettings: Init = {
        ...this.guildSettings,
        "created": this.message.guild!.createdTimestamp,
        "joined": this.message.guild!.joinedTimestamp,
        "icon": this.message.guild!.iconURL({format: "png", dynamic: true}),
        "splash": this.message.guild!.splashURL({format: "png"}),
        "banner": this.message.guild!.bannerURL({format: "png"}),
        "region": this.message.guild!.region,
        "owner": this.message.guild!.owner!.user.tag,
        "owner id": this.message.guild!.ownerID,
        "games": this.message.guild!.presences.cache.map((presence: Presence) => presence.activities.join("") ? presence.activities.map((a) => a?.name) : [null]).flat(Infinity)
    }

    private readonly userSettings: Init = {
        ...this.guildSettings,
        "user list": this.message.guild!.members.cache.map((member: GuildMember) => member.displayName),
        "user id list": this.message.guild!.members.cache.map((member: GuildMember) => member.id),
        "user join list": this.message.guild!.members.cache.map((member: GuildMember) => member.joinedTimestamp)
    }

    private readonly channelSettings: Init = {
        ...this.guildSettings,
        "channel list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.name),
        "channel id list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.id),
        "channel created list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.createdTimestamp),
        "category list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.parent ? channel.parent.name : null),
        "category id list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.parentID ? channel.parentID : null)
    }

    private readonly roleSettings: Init = {
        ...this.guildSettings,
        "role list": this.message.guild!.roles.cache.map((role: Role) => role.name),
        "role id list": this.message.guild!.roles.cache.map((role: Role) => role.id),
        "role created list": this.message.guild!.roles.cache.map((role: Role) => role.createdTimestamp),
        "role color list": this.message.guild!.roles.cache.map((role: Role) => role.hexColor)
    }

    private readonly emojiSettings: Init = {
        ...this.guildSettings,
        "emoji list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.name),
        "emoji id list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.id),
        "emoji created list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.createdTimestamp),
        "emoji identifier list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.identifier)
    }

    private readonly logSettings: Init = {
        ...this.guildSettings,
        "mod log": null,
        "message log": null,
        "user log": null,
        "member log": null
    }

    private readonly specialChannelSettings: Init = {
        ...this.guildSettings,
        "star channel": null,
        "star threshold": 3,
        "pin channel": null,
        "yt channels": null,
        "twitch channels": null,
        "global chat": null,
        "linked": null
    }

    private readonly specialRoleSettings: Init = {
        ...this.guildSettings,
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
        ...this.guildSettings,
        "user id list": this.message.guild!.members.cache.map((member: GuildMember) => member.id),
        "score list": null,
        "level list": null,
        "point range": [10, 20],
        "point threshold": 1000,
        "level message": "Congrats user, you are now level newlevel!",
        "point timeout": 60000,
        "point toggle": "off"
    }

    private readonly welcomeLeaveSettings: Init = {
        ...this.guildSettings,
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
        ...this.guildSettings,
        "birthday user list": null,
        "birthday date list": null,
        "birthday channel": null,
        "birthday message": "Happy birthday to user!",
        "birthday toggle": "off"
    }

    private readonly imageSettings: Init = {
        ...this.guildSettings,
        "image channels": null,
        "dropbox folders": null,
        "google albums": null,
        "notify toggle": "on"
    }

    private readonly warnSettings: Init = {
        ...this.guildSettings,
        "warn log": null,
        "warn penalty": "none",
        "warn threshold": 3
    }

    private readonly blockSettings: Init = {
        ...this.guildSettings,
        "blocked words": null,
        "disabled commands": null,
        "pfp ban toggle": "off",
        "leaver ban toggle": "off",
        "ascii name toggle": "off",
        "default channel": null,
        "block match": "partial",
        "block toggle": "off",
        "link ban": "off",
        "asterisk": "off",
        "invite": "off",
        "self promo": "None"
    }

    private readonly captchaSettings: Init = {
        ...this.guildSettings,
        "verify toggle": "off",
        "verify role": null,
        "captcha type": "text",
        "captcha color": "#ffffff",
        "difficulty": "medium"
    }

    private readonly autoSettings: Init = {
        ...this.guildSettings,
        command: null,
        channel: null,
        frequency: null,
        toggle: null,
        timeout: null
    }

    private readonly detectionSettings: Init = {
        ...this.guildSettings,
        links: "on",
        anime: "off",
        pfp: "off",
        weeb: null,
        normie: null,
        ignored: null
    }

    private readonly configSettings: Init = {
        ...this.guildSettings,
        "embed colors": ["default"],
        "permissions": "role"
    }

    private readonly tableMap: object = {
        "guilds": this.guildInfoSettings,
        "users": this.userSettings,
        "prefixes": this.prefixSetting,
        "timezones": this.timezoneSetting,
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

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
        "members": this.message.guild!.memberCount,
        "icon": this.message.guild!.iconURL({format: "png", dynamic: true}),
        "splash": this.message.guild!.splashURL({format: "png"}),
        "banner": this.message.guild!.bannerURL({format: "png"}),
        "region": this.message.guild!.region,
        "owner": this.message.guild!.owner!.user.tag,
        "owner id": this.message.guild!.ownerID,
        "games": this.message.guild!.presences.cache.map((presence: Presence) => presence.activities.join("") ? presence.activities.map((a) => a?.name) : [null]).flat(Infinity),
        "channel list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.name),
        "category list": this.message.guild!.channels.cache.map((channel: GuildChannel) => channel.parent ? channel.parent.name : null),
        "user list": this.message.guild!.members.cache.map((member: GuildMember) => member.displayName),
        "role list": this.message.guild!.roles.cache.map((role: Role) => role.name),
        "emoji list": this.message.guild!.emojis.cache.map((emoji: GuildEmoji) => emoji.name),
        "prefix": "=>",
        "mod log": null,
        "message log": null,
        "user log": null,
        "member log": null,
        "starboard": null,
        "star threshold": 3,
        "star emoji": "⭐",
        "pinboard": null,
        "nsfw pinboard": null,
        "yt channels": null,
        "twitch channels": null,
        "global chat": null,
        "linked": null,
        "gallery": null,
        "mute role": null,
        "restricted role": null,
        "warn one": null,
        "warn two": null,
        "mod role": null,
        "admin role": null,
        "self roles": null,
        "reaction roles": null,
        "emoji roles": null,
        "warn log": null,
        "warn penalty": "none",
        "warn threshold": 3,
        "cases": null,
        "blocked words": null,
        "disabled categories": null,
        "pfp ban toggle": "off",
        "leaver ban toggle": "off",
        "everyone ban toggle": "off",
        "ascii name toggle": "off",
        "default channel": null,
        "block match": "partial",
        "block toggle": "off",
        "link ban": "off",
        "asterisk": "off",
        "invite": "off",
        "self promo": "None",
        "verify toggle": "off",
        "verify role": null,
        "captcha type": "text",
        "captcha color": "#ffffff",
        "difficulty": "medium",
        "links": "on",
        "anime": "off",
        "pfp": "off",
        "response": "on",
        "weeb": null,
        "normie": null,
        "ignored": null,
        "welcome channel": null,
        "welcome message": "Welcome to guild, user!",
        "welcome toggle": "off",
        "welcome bg images": ["https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif"],
        "welcome bg text": "Welcome tag! There are now count members.",
        "welcome bg color": "rainbow",
        "welcome bg toggle": "on",
        "leave channel": null,
        "leave message": "user has left guild!",
        "leave toggle": "off",
        "leave bg images": ["https://data.whicdn.com/images/210153523/original.gif"],
        "leave bg text": "tag left! There are now count members.",
        "leave bg color": "rainbow",
        "leave bg toggle": "on",
        "embed colors": ["default"],
        "permissions": "role",
        "voice": "off",
        "scores": null,
        "point range": [10, 20],
        "point threshold": 1000,
        "level message": "Congrats user, you are now level newlevel!",
        "point timeout": 60000,
        "point toggle": "off",
        "level roles": null,
        "level channels": null,
        "image channels": null,
        "dropbox folders": null,
        "google albums": null,
        "notify toggle": "on",
        "auto": null,
        "birthdays": null,
        "birthday channel": null,
        "birthday message": "Happy birthday to user!",
        "birthday toggle": "off"
    }

    private readonly tableMap: object = {
        guilds: this.guildSettings
    }

    // Initialize all tables
    public initAll = async () => {
        const entries = Object.entries(this.tableMap)
        for (const [table, object] of entries) {
            const settings = Object.entries(object)
            for (const [column, value] of settings) {
                if (column === "scores") {
                    const exists = await this.sql.fetchColumn("guilds", "scores")
                    if (exists) continue
                }
                await this.sql.updateColumn(table, column, value)
              }
          }
        return
    }
}

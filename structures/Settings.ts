/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Kisaragi - A kawaii discord bot ❤                         *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {Message} from "discord.js"
import {SQLQuery} from "./SQLQuery"

interface Init {
    [propName: string]: unknown
}

export class Settings {
    private readonly sql: SQLQuery
    private tableMap: object
    private initSettings: Init
    private guildSettings: Init
    private autoSettings: Init
    private birthdaySettings: Init
    private blockSettings: Init
    private captchaSettings: Init
    private configSettings: Init
    private detectSettings: Init
    private logSettings: Init
    private pointSettings: Init
    private specialRoleSettings: Init
    private specialChannelSettings: Init
    private warnSettings: Init
    private welcomeLeaveSettings: Init

   constructor(private readonly message: Message) {
        this.sql = new SQLQuery(this.message)

        this.initSettings = {
            "guild id": this.message.guild!.id
        }

        this.guildSettings = {
            ...this.initSettings,
            "name": this.message.guild!.name,
            "members": this.message.guild!.memberCount,
            "prefix": "=>"
        }

        this.autoSettings = {
            ...this.initSettings,
            "auto commands": null,
            "auto channels": null,
            "auto frequencies": null,
            "auto timeouts": null,
            "auto toggles": null
        }

        this.birthdaySettings = {
            ...this.initSettings,
            "birthdays": null,
            "birthday channel": null,
            "birthday message": "Happy birthday to user!",
            "birthday toggle": "off"
        }

        this.blockSettings = {
            ...this.initSettings,
            "blocked words": null,
            "block match": "partial",
            "block toggle": "off",
            "asterisk": "off",
            "invite": "off",
            "self promo": "None",
            "pfp ban toggle": "off",
            "everyone ban toggle": "off",
            "ascii name toggle": "off",
            "default channel": null,
            "link ban": "off"
        }

        this.captchaSettings = {
            ...this.initSettings,
            "verify toggle": "off",
            "verify role": null,
            "captcha type": "text",
            "captcha color": "#ffffff",
            "difficulty": "medium"
        }

        this.configSettings = {
            ...this.initSettings,
            "embed colors": ["default"],
            "permissions": "role"
        }

        this.detectSettings = {
            ...this.initSettings,
            "pfp": "off",
            "weeb": null,
            "normie": null,
            "links": "off",
            "anime": "off",
            "response": "off",
            "ignored": null,
            "disabled categories": null
        }

        this.logSettings = {
            ...this.initSettings,
            "mod log": null,
            "warn log": null,
            "message log": null,
            "user log": null,
            "member log": null,
            "guild log": null
        }

        this.pointSettings = {
            ...this.initSettings,
            "scores": null,
            "point range": [10, 20],
            "point threshold": 1000,
            "level message": "Congrats user, you are now level newlevel!",
            "point timeout": 60000,
            "point toggle": "off",
            "level roles": null,
            "level channels": null
        }

        this.specialRoleSettings = {
            ...this.initSettings,
            "admin role": null,
            "mod role": null,
            "mute role": null,
            "restricted role": null,
            "warn one": null,
            "warn two": null,
            "self roles": null,
            "reaction roles": null,
            "emoji roles": null
        }

        this.specialChannelSettings = {
            ...this.initSettings,
            "linked": null,
            "gallery": null,
            "sources": null,
            "pinboard": null,
            "nsfw pinboard": null,
            "starboard": null,
            "star threshold": 3,
            "star emoji": "⭐",
            "global chat": null,
            "yt channels": null,
            "twitch channels": null
        }

        this.warnSettings = {
            ...this.initSettings,
            "warn penalty": "none",
            "warn threshold": 3,
            "cases": null
        }

        this.welcomeLeaveSettings = {
            ...this.initSettings,
            "welcome channel": null,
            "welcome message": "Welcome to guild, user!",
            "welcome toggle": "off",
            "welcome bg images": ["https://i.imgur.com/WOYlL17.gif"],
            "welcome bg text": "Welcome username! There are now count members.",
            "welcome bg color": "rainbow",
            "welcome bg toggle": "on",
            "leave channel": null,
            "leave message": "user has left guild!",
            "leave toggle": "off",
            "leave bg images": ["https://i.imgur.com/3KoLVtn.gif"],
            "leave bg text": "username left! There are now count members.",
            "leave bg color": "rainbow",
            "leave bg toggle": "on"
        }

        this.tableMap = {
            "guilds": this.guildSettings,
            "auto": this.autoSettings,
            "birthdays": this.birthdaySettings,
            "blocks": this.blockSettings,
            "captcha": this.captchaSettings,
            "config": this.configSettings,
            "detect": this.detectSettings,
            "logs": this.logSettings,
            "points": this.pointSettings,
            "special roles": this.specialRoleSettings,
            "special channels": this.specialChannelSettings,
            "warns": this.warnSettings,
            "welcome leaves": this.welcomeLeaveSettings
        }
    }

    // Populate async fields
    public populateAsync = async () => {
        const owner = await this.message.guild?.fetchOwner()
        const asyncSettings = {
            "owner": owner?.user.username,
            "owner id": owner?.user.id
        }
        this.guildSettings = {...this.guildSettings, ...asyncSettings}
        this.tableMap = {guilds: this.guildSettings}
    }

    // Initialize all tables
    public initAll = async () => {
        await this.populateAsync()
        const entries = Object.entries(this.tableMap)
        for (const [table, object] of entries) {
            const settings = Object.entries(object)
            for (const [column, value] of settings) {
                if (column === "scores") {
                    const exists = await this.sql.fetchColumn("points", "scores")
                    if (exists) continue
                }
                await this.sql.updateColumn(table, column, value)
              }
          }
        return
    }
}

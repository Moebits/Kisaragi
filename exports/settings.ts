module.exports = (client: any, message: any) => {

    const guildSettings: object = {
        "name": message.guild.name,
        "guild id": message.guild.id,
        "members": message.guild.memberCount,
    }

    const prefixSetting: object = {
        "prefix": "=>",
      }

    const timezoneSetting: object = {
        "timezone": "GMT -4"
    }
    
    const guildInfoSettings: object = {
        "created": message.guild.createdTimestamp,
        "joined": message.guild.joinedTimestamp,
        "icon": message.guild.iconURL,
        "splash": message.guild.splashURL,
        "region": message.guild.region,
        "owner": message.guild.owner.user.tag,
        "owner id": message.guild.ownerID,
        "games": message.guild.presences.map((presence: any) => presence.game !== null ? presence.game.name : null)
    }

    const userSettings: object = {
        "user list": message.guild.members.map((member: any) => member.displayName),
        "user id list": message.guild.members.map((member: any) => member.id),
        "user join list": message.guild.members.map((member: any) => member.joinedTimestamp)
    }

    const channelSettings: object = {
        "channel list": message.guild.channels.map((channel: any) => channel.name),
        "channel id list": message.guild.channels.map((channel: any) => channel.id),
        "channel created list": message.guild.channels.map((channel: any) => channel.createdTimestamp),
        "category list": message.guild.channels.map((channel: any) => channel.parent !== null ? channel.parent.name : null),
        "category id list": message.guild.channels.map((channel: any) => channel.parent !== null ? channel.parentID : null)
    }

    const roleSettings: object = {
        "role list": message.guild.roles.map((role: any) => role.name),
        "role id list": message.guild.roles.map((role: any) => role.id),
        "role created list": message.guild.roles.map((role: any) => role.createdTimestamp),
        "role color list": message.guild.roles.map((role: any) => role.hexColor),
    }

    const emojiSettings: object = {
        "emoji list": message.guild.emojis.map((emoji: any) => emoji.name),
        "emoji id list": message.guild.emojis.map((emoji: any) => emoji.id),
        "emoji created list": message.guild.emojis.map((emoji: any) => emoji.createdTimestamp),
        "emoji identifier list": message.guild.emojis.map((emoji: any) => emoji.identifier)
    }
    
    const logSettings: object = {
        "mod log": null,
        "message log": null,
        "user log": null,
        "guild log": null,
        "client log": null
    }

    const specialChannelSettings: object = {
        "star channel": null,
        "star threshold": 3,
        "pin channel": null
    }

    const specialRoleSettings: object = {
        "mute role": null,
        "restricted role": null
    }

    const pointSettings: object = {
        "score list": null,
        "level list": null,
        "point range": [10, 20],
        "point threshold": 1000,
        "level message": "Congrats user, you are now level newlevel!",
        "point timeout": 60000,
        "point toggle": "off"
    }

    const welcomeLeaveSettings: object = {
        "welcome channel": null,
        "welcome message": "Welcome to guild, user!",
        "welcome toggle": "off",
        "leave channel": null,
        "leave message": "user has left guild!",
        "leave toggle": "off",
        "welcome bg image": "https://66.media.tumblr.com/692aa1fd2a5ad428d92b27ccf65d4a94/tumblr_inline_n0oiz974M41s829k0.gif",
        "welcome bg text": "Welcome tag! There are now count members.",
        "welcome bg color": "rainbow",
        "leave bg image": "https://user-images.githubusercontent.com/565124/32411599-a5fcba72-c1df-11e7-8730-a570470a4eee.gif",
        "leave bg text": "tag left! There are now count members.",
        "leave bg color": "rainbow"
    }

    const birthdaySettings: object = {
        "birthday user id": null,
        "birthday date": null,
        "birthday channel": null,
        "birthday message": "Happy birthday to {{user}}!",
        "birthday toggle": "off"
    }

    const imageSettings: object = {
        "image channels": null,
        "dropbox folders": null,
        "google albums": null,
        "notify toggle": "off"
    }

    const warnSettings: object = {
        "warn log": null,
        "warn penalty": null,
        "warn threshold": 3
    }

    const blockSettings: object = {
        "blocked words": null,
        "disabled commands": null,
        "pfp ban toggle": "off",
        "leaver ban toggle": "off",
        "ascii name toggle": "off",
        "default channel": null
    }

    const captchaSettings: object = {
        "verify toggle": "off",
        "verify role": null,
        "captcha type": "text",
        "captcha color": "#ffffff",
        "difficulty": "medium"
    }

    const autoSettings: object = {
        "command": null,
        "channel": null,
        "frequency": null
    }

    //Initialize a table
    client.initTable = async (table: string, object: object) => {       
        const entries = Object.entries(object);
        try {
          for (let [key, value] of entries) {
            await client.updateColumn(table, key, value);
          }
        } catch (error) {
          throw error
        } 
    }

    const tableMap: object = {
        "prefixes": prefixSetting,
        "timezones": timezoneSetting,
        "guilds": guildSettings,
        "guild info": guildInfoSettings,
        "users": userSettings,
        "channels": channelSettings,
        "roles": roleSettings,
        "emojis": emojiSettings,
        "logs": logSettings,
        "special channels": specialChannelSettings,
        "special roles": specialRoleSettings,
        "points": pointSettings,
        "welcome leaves": welcomeLeaveSettings,
        "birthdays": birthdaySettings,
        "images": imageSettings,
        "warns": warnSettings,
        "blocks": blockSettings,
        "captcha": captchaSettings,
        "auto": autoSettings
    }

    //Initialize all tables
    client.initAll = async () => {
        const entries = Object.entries(tableMap);
        try {
          for (let [key, value] of entries) {
            await client.initTable(key, value);
          }
        } catch (error) {
          throw error
        } 
    }
}
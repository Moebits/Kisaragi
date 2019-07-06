module.exports = (client: any, message: any) => {

    const database = require('../database.js');
    require('./queries.js')(client, message);

    const prefixSetting: object = {
        "prefix": "=>",
      }

    const timezoneSetting: object = {
        "timezone": "GMT -4"
    }
    
    const guildSettings: object = {
        "name": message.guild.name,
        "guild id": message.guild.id,
        "members": message.guild.memberCount,
    }

    const guildInfoSettings: object = {
        "created": message.guild.createdTimestamp,
        "joined": message.guild.joinedTimestamp,
        "icon": message.guild.iconURL,
        "splash": message.guild.splashURL,
        "region": message.guild.region,
        "owner": message.guild.owner,
        "owner id": message.guild.ownerID,
        "games": message.guild.presences.map((presence: any) => presence.game.name)
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
        "category list": message.guild.channels.map((channel: any) => channel.parent.name),
        "category id list": message.guild.channels.map((channel: any) => channel.parentID)
    }

    const roleSettings: object = {
        "role list": message.guild.roles.map((role: any) => role.name),
        "role id list": message.guild.roles.map((role: any) => role.id),
        "role created list": message.guild.roles.map((role: any) => role.createdTimestamp),
        "role color list": message.guild.roles.map((role: any) => role.hexColor),
    }

    const emojiSettings: object = {
        "emoji list": message.guild.emojis.map((emoji:any) => emoji.name),
        "emoji id list": message.guild.emojis.map((emoji:any) => emoji.id),
        "emoji created list": message.guild.emojis.map((emoji:any) => emoji.createdTimestamp),
        "emoji identifier list": message.guild.emojis.map((emoji:any) => emoji.identifier)
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
        "restricted role": null,
        "verified role": null
    }

    const pointSettings: object = {
        "score list": null,
        "level list": null,
        "point range": [10, 20],
        "point threshold": 1000
    }

    const welcomeLeaveSettings: object = {
        "welcome channel": null,
        "welcome message": "Welcome to {{guild}}, {{user}}!",
        "welcome toggle": "off",
        "leave channel": null,
        "leave message": "{{user}} has left {{guild}}!",
        "leave toggle": "off",
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
        "ascii name toggle": "off"
    }

    //Initialize a table
    client.initTable = async (table: string, object: object) => {
        const entries = Object.entries(object);
        const pgClient = await database.connect();
        try {
          await pgClient.query(`BEGIN`);
          for (const [column, value] of entries) {
            await pgClient.query(client.insertInto(`${table}, ${column}, ${value}`));
          }
          await pgClient.query(`COMMIT`);
        } catch (error) {
          await pgClient.query(`ROLLBACK`);
          throw error
        } finally {
          pgClient.release();
        }
    }

    //Initialize all tables
    client.initAll = async () => {
        await client.initTable("prefixes", prefixSetting);
        await client.initTable("timezones", timezoneSetting);
        await client.initTable("guilds", guildSettings);
        await client.initTable("guild info", guildInfoSettings);
        await client.initTable("users", userSettings);
        await client.initTable("channels", channelSettings);
        await client.initTable("roles", roleSettings);
        await client.initTable("emojis", emojiSettings);
        await client.initTable("logs", logSettings);
        await client.initTable("special channels", specialChannelSettings);
        await client.initTable("special roles", specialRoleSettings);
        await client.initTable("points", pointSettings);
        await client.initTable("welcome leaves", welcomeLeaveSettings);
        await client.initTable("birthdays", birthdaySettings);
        await client.initTable("images", imageSettings);
        await client.initTable("warns", warnSettings);
        await client.initTable("blocks", blockSettings);
    }
}
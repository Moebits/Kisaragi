const Redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(Redis.RedisClient.prototype);

const redis = Redis.createClient({
  url: process.env.REDIS_URL
});

const Pool: any = require('pg').Pool;

    const pgPool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      sslmode: process.env.PGSSLMODE,
      max: 10
    });


module.exports = async (client: any, message: any) => {

    const tableList: string[] = [
        "birthdays",
        "blocks",
        "channels",
        "emojis",
        "guild info",
        "guilds",
        "images",
        "logs",
        "points",
        "prefixes",
        "roles",
        "special channels",
        "special roles",
        "timezones",
        "users",
        "warns",
        "welcome leaves",
        "captcha",
        "auto",
        "links",
        "detection"
    ];

    //Run Query
    client.runQuery = async (query: any, newData?: boolean, raw?: boolean) => {
      let start: number = Date.now();
      let redisResult = await redis.getAsync(JSON.stringify(query));
      if (newData) redisResult = null;
      if (redisResult) {
        client.logQuery(Object.values(query)[0], start, true);
        if (raw) return JSON.parse(redisResult);
        return (JSON.parse(redisResult))[0]
      } else {
        const pgClient = await pgPool.connect();
          try {
            const result = await pgClient.query(query);
            //client.logQuery(Object.values(query)[0], start);
            await redis.setAsync(JSON.stringify(query), JSON.stringify(result.rows))
            if (raw) return result.rows;
            return result.rows[0]
          } catch(error) {
            console.log(error.stack); 
          } finally {
            pgClient.release(true);
          }
      }
    }

    //Log Query
    client.logQuery = (text: string, start: number, blue?: boolean) => {
      const duration: number = Date.now() - start;
      let color: string = "";
      if (blue) {
        color = "cyanBright";
      } else {
        color = "magentaBright";
      }
      let chalk: any = require("chalk");
      let moment: any = require("moment");
      const timestamp: string = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
      
      let queryString: string = `${timestamp} Executed query ${text} in ${duration} ms`;
      console.log(chalk`{${color} ${queryString}}`);
    }

    //Flush Redis DB
    client.flushDB = async () => {
      await redis.flushdbAsync();
    }

    //Fetch a row 
    client.fetchRow = async (table: string, update?: boolean) => {
        if (message === null) return;
        let query: object = {
          text: `SELECT * FROM "${table}" WHERE "guild id" = ${message.guild.id}`,
          rowMode:'array'
        }
        let result;
        if (update) {
          result = await client.runQuery(query, true);
        } else {
          result = await client.runQuery(query);
        }
        return result;
    }

    //Fetch commands
    client.fetchCommand = async (command: string, column: string, update?: boolean) => {
        let query: object = {
          text: `SELECT "${column}" FROM commands WHERE command IN ($1)`,
          values: [command],
          rowMode: 'array'
        };
        let result;
        if (update) {
          result = await client.runQuery(query, true);
        } else {
          result = await client.runQuery(query);
        }
        return result;
    }

    //Fetch aliases
    client.fetchAliases = async (update?: boolean) => {
        let query: object = {
          text: `SELECT aliases FROM commands`,
          rowMode: 'array'
        }
        let result;
        if (update) {
          result = await client.runQuery(query, true);
        } else {
          result = await client.runQuery(query);
        }
        return result;
    }

    //Fetch Prefix
    client.fetchPrefix = async (update?: boolean) => {
        let query: object = {
          text: `SELECT prefix FROM prefixes WHERE "guild id" = ${message.guild.id}`,
          rowMode: 'array'
        }
        let result;
        if (update) {
          result = await client.runQuery(query, true);
        } else {
          result = await client.runQuery(query);
        }
        if(!result.join("")) return "=>";
        return result[0];
    }

    //Fetch a column
    client.fetchColumn = async (table: string, column: string, key?: any, value?: any, update?: boolean) => {
      let query: object;
      if (key) {
        query = {
          text: `SELECT "${column}" FROM "${table}" WHERE "${key}" = ${value}`,
          rowMode: 'array'
        }
      } else {
        query = {
          text: `SELECT "${column}" FROM "${table}" WHERE "guild id" = ${message.guild.id}`,
          rowMode: 'array'
        }
      }
      let result;
        if (update) {
          result = await client.runQuery(query, true);
        } else {
          result = await client.runQuery(query);
        }
      return result;
    }

    //Select whole column
    client.selectColumn = async (table: string, column: string, update?: boolean) => {
      let query = {
        text: `SELECT "${column}" FROM "${table}"`,
        rowMode: 'array'
      }
      let result;
        if (update) {
          result = await client.runQuery(query, true, true);
        } else {
          result = await client.runQuery(query, false, true);
        }
      return result;
    }

    //Insert row into a table
    client.insertInto = async (table: string, column: string, value: any) => {
        let query: object = {
          text: `INSERT INTO "${table}" ("${column}") VALUES ($1)`,
          values: [value]
        }
        await client.runQuery(query, true);
    }

    //Insert command
    client.insertCommand = async (command: string, aliases: string[], path: string, cooldown: string) => {
      let query: object = {
        text: `INSERT INTO commands (command, aliases, path, cooldown) VALUES ($1, $2, $3, $4)`,
        values: [command, aliases, path, cooldown]
      }
      await client.runQuery(query, true);
  }

  //Update Prefix
  client.updatePrefix = async (prefix: string) => {
    let query = {
        text: `UPDATE "prefixes" SET "prefix" = $1 WHERE "guild id" = ${message.guild.id}`,
        values: [prefix]
      }
    await client.runQuery(query, true);
    client.fetchPrefix(true);
}

    //Update a row in a table
    client.updateColumn = async (table: string, column: string, value: any, key?: string, keyVal?: string) => {
        let query: object;
        if (key) {
          query = {
            text: `UPDATE "${table}" SET "${column}" = $1 WHERE "${key}" = $2`,
            values: [value, keyVal]
          }
        } else {
          query = {
            text: `UPDATE "${table}" SET "${column}" = $1 WHERE "guild id" = ${message.guild.id}`,
            values: [value]
          }
        }
        await client.runQuery(query, true);
        client.selectColumn(table, column, true);
        if (key) { 
          await client.fetchColumn(table, column, key, keyVal, true);
        } else {
          await client.fetchColumn(table, column, false, false, true);
          client.fetchRow(table, true);
        }
    }

    //Update Command
    client.updateCommand = async (command: string, aliases: any, cooldown: string) => {
      let query: object = {
        text: `UPDATE commands SET aliases = $1, cooldown = $2 WHERE "command" = $3`,
        values: [aliases, cooldown, command]
      }
      await client.runQuery(query, true);
      client.fetchCommand(command, "aliases", true);
      client.fetchCommand(command, "cooldown", true);
      client.fetchAliases(true);
  }

    //Remove a guild from all tables
    client.deleteGuild = async (guild: number) => {
        for (let i = 0; i < tableList.length; i++) {
            let query: object = {
              text: `DELETE FROM "${tableList[i]}" WHERE "guild id" = $1`,
              values: [guild]
            }
            await client.runQuery(query, true);
        }
    }

    //Order tables by guild member count
    client.orderTables = async () => {
        for (let table in tableList) {
            let query: object = {
              text: `SELECT members FROM "${tableList[table]}" ORDER BY 
              CASE WHEN "guild id" = '578604087763795970' THEN 0 ELSE 1 END, members DESC`
            }
            await client.runQuery(query, true);
        }
    }

    //Init guild
    client.initGuild = async () => {
    await require("./settings.js")(client, message);
        let query: object = {
          text: `SELECT "guild id" FROM guilds`,
          rowMode: 'array'
        }
        const result = await client.runQuery(query, true);
        const found = result.find((id: any) => id[0] === message.guild.id.toString());
        if (!found) {
          for (let i in tableList) {
            await client.insertInto(tableList[i], "guild id", message.guild.id);
          }
          await client.initAll();
          await client.orderTables();
        }
    }
}
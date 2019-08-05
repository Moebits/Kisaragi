let changedCommand = new Set();
let changedPrefix = new Set();
let changedColumn = new Set();


const Redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(Redis.RedisClient.prototype);

const redis = Redis.createClient({
  url: process.env.REDIS_URL
});


module.exports = async (client: any, message: any) => {

    const Pool: any = require('pg').Pool;

    client.pgPool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      sslmode: process.env.PGSSLMODE,
      max: 20
    });

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
        "welcome leaves"
    ];

    //Run Query
    client.runQuery = async (query: any, column?: boolean, command?: boolean, prefix?: boolean) => {
      let start: number = Date.now();
      let redisResult = await redis.getAsync(JSON.stringify(query));
      if (prefix) {
        if (changedPrefix.has(message.guild.id)) {
          redisResult = null;
          changedPrefix.delete(message.guild.id);
        }
      }
      if (command) {
        if (changedCommand.size > 0) {
          redisResult = null;
          changedCommand.clear();
        }
      }
      if (column) {
        if (changedColumn.has(message.guild.id)) {
          redisResult = null;
          changedColumn.delete(message.guild.id);
        }
      }
      if (redisResult) {
        client.logQuery(Object.values(query)[0], start, true);
        return (JSON.parse(redisResult))[0]
      } else {
        const pgClient = await client.pgPool.connect();
          try {
            const result = await pgClient.query(query);
            client.logQuery(Object.values(query)[0], start);
            await redis.setAsync(JSON.stringify(query), JSON.stringify(result.rows))
            return result.rows[0]
          } catch(error) {
            console.log(error.stack); 
          } finally {
            await pgClient.release();
          }
      }
    }

    //Log Query
    client.logQuery = (text: string, start: number, blue?: boolean) => {
      let color: string = "";
      if (blue) {
        color = "cyanBright";
      } else {
        color = "magentaBright";
      }
      let chalk: any = require("chalk");
      let moment: any = require("moment");
      const timestamp: string = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
      const duration: number = Date.now() - start;
      let queryString: string = `${timestamp} Executed query ${text} in ${duration} ms`;
      console.log(chalk`{${color} ${queryString}}`);
    }

    //Flush Redis DB
    client.flushDB = async () => {
      await redis.flushdbAsync();
    }

    //Fetch a row 
    client.fetchRow = async (table: string) => {
        if (message === null) return;
        let query: object = {
          text: `SELECT * FROM "${table}" WHERE "guild id" = ${message.guild.id}`,
          rowMode:'array'
        }
        const result: any = await client.runQuery(query, true);
        return result;
    }

    //Fetch commands
    client.fetchCommand = async (command: string, column: string) => {
        let query: object = {
          text: `SELECT "${column}" FROM commands WHERE command IN ($1)`,
          values: [command],
          rowMode: 'array'
        };
        const result: any = await client.runQuery(query, false, true);
        return result;
    }

    //Fetch aliases
    client.fetchAliases = async () => {
        let query: object = {
          text: `SELECT aliases FROM commands`,
          rowMode: 'array'
        }
        const result: any = await client.runQuery(query, false, true);
        return result;
    }

    //Fetch Prefix
    client.fetchPrefix = async () => {
        let query: object = {
          text: `SELECT prefix FROM prefixes WHERE "guild id" = ${message.guild.id}`,
          rowMode: 'array'
        }
        const result: any = await client.runQuery(query, false, false, true);
        if(!result.join("")) return "=>";
        return result[0];
    }

    //Fetch a column
    client.fetchColumn = async (table: string, column: string, key?: string, value?: string) => {
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
      const result: any = await client.runQuery(query, true);
      return result;
    }

    //Select whole column
    client.selectColumn = async (table: string, column: string) => {
      let query = {
        text: `SELECT "${column}" FROM "${table}"`,
        rowMode: 'array'
      }
      const result: any = await client.runQuery(query, true);
      return result;
    }

    //Insert row into a table
    client.insertInto = async (table: string, column: string, value: any) => {
        let query: object = {
          text: `INSERT INTO "${table}" ("${column}") VALUES ($1)`,
          values: [value]
        }
        changedColumn.add(message.guild.id);
        await client.runQuery(query, true);
    }

    //Insert command
    client.insertCommand = async (command: string, aliases: string[], path: string, cooldown: string) => {
      let query: object = {
        text: `INSERT INTO commands (command, aliases, path, cooldown) VALUES ($1, $2, $3, $4)`,
        values: [command, aliases, path, cooldown]
      }
      changedCommand.add("updated");
      await client.runQuery(query, false, true);
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
        changedColumn.add(message.guild.id);
        await client.runQuery(query, true);
    }

    //Update Command
    client.updateCommand = async (command: string, aliases: any, cooldown: string) => {
      let query: object = {
        text: `UPDATE commands SET aliases = $1, cooldown = $2 WHERE "command" = $3`,
        values: [aliases, cooldown, command]
      }
      changedCommand.add("updated");
      await client.runQuery(query, false, true);
  }

    //Remove a guild from all tables
    client.deleteGuild = async (guild: number) => {
        for (let i = 0; i < tableList.length; i++) {
            let query: object = {
              text: `DELETE FROM "${tableList[i]}" WHERE "guild id" = $1`,
              values: [guild]
            }
            changedColumn.add(message.guild.id);
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
            changedColumn.add(message.guild.id);
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
        changedColumn.add(message.guild.id);
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
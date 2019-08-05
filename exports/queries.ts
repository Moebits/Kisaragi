module.exports = async (client: any, message: any) => {

    const Pool: any = require('pg').Pool;
    const redis = require("async-redis");
    const {PostgresRedisAsync} = require("postgres-redis");
    client.redis = redis.createClient({
      url: process.env.REDIS_URL
    });

    client.pgPool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      sslmode: process.env.PGSSLMODE,
      max: 10
    });

    client.postgresRedis = new PostgresRedisAsync(
      client.pgPool,
      client.redis
  );

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
    client.runQuery = async (query: any, redis?: boolean) => {
      let start: number = Date.now();
      if (redis) {
        try {
          const result = await client.postgresRedis.query(query);
          client.logQuery(Object.values(query)[0], start, true);
          return result.rows;
        } catch(error) {
          console.log(error.stack); 
        }
      } else {
        const pgClient = await client.pgPool.connect();
          try {
            const result = await pgClient.query(query);
            client.logQuery(Object.values(query)[0], start);
            return result.rows;
          } catch(error) {
            console.log(error.stack); 
          } finally {
            pgClient.release();
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

    //Fetch a row 
    client.fetchRow = async (table: string) => {
        if (message === null) return;
        let query: object = {
          text: `SELECT * FROM "${table}" WHERE "guild id" = ${message.guild.id}`,
          rowMode:'array'
        }
        const result: any = await client.runQuery(query, true);
        return result[0];
    }

    //Fetch commands
    client.fetchCommand = async (command: string, column: string) => {
        let query: object = {
          text: `SELECT "${column}" FROM commands WHERE command IN ($1)`,
          values: [command],
          rowMode: 'array'
        };
        const result: any = await client.runQuery(query);
        return result[0];
    }

    //Fetch aliases
    client.fetchAliases = async () => {
        let query: object = {
          text: `SELECT aliases FROM commands`,
          rowMode: 'array'
        }
        const result: any = await client.runQuery(query, true);
        return result[0];
    }

    //Fetch Prefix
    client.fetchPrefix = async () => {
        let query: object = {
          text: `SELECT prefix FROM prefixes WHERE "guild id" = ${message.guild.id}`,
          rowMode: 'array'
        }
        const result: any = await client.runQuery(query, true);
        if(!result.join("")) return "=>";
        return result[0][0];
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
      const result: any = await client.runQuery(query);
      return result[0];
    }

    //Select column No Redis
    client.selectColumn = async (table: string, column: string) => {
      let query = {
        text: `SELECT "${column}" FROM "${table}"`,
        rowMode: 'array'
      }
      const result: any = await client.runQuery(query);
      return result;
    }

    //Insert row into a table
    client.insertInto = async (table: string, column: string, value: any) => {
        let query: object = {
          text: `INSERT INTO "${table}" ("${column}") VALUES ($1)`,
          values: [value]
        }
        await client.runQuery(query);
    }

    //Insert command
    client.insertCommand = async (command: string, aliases: string[], path: string, cooldown: string) => {
      let query: object = {
        text: `INSERT INTO commands (command, aliases, path, cooldown) VALUES ($1, $2, $3, $4)`,
        values: [command, aliases, path, cooldown]
      }
      await client.runQuery(query);
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
        await client.runQuery(query);
    }

    //Update Command
    client.updateCommand = async (command: string, aliases: any, cooldown: string) => {
      let query: object = {
        text: `UPDATE commands SET aliases = $1, cooldown = $2 WHERE "command" = $3`,
        values: [aliases, cooldown, command]
      }
      await client.runQuery(query);
  }

    //Remove a guild from all tables
    client.deleteGuild = async (guild: number) => {
        for (let i = 0; i < tableList.length; i++) {
            let query: object = {
              text: `DELETE FROM "${tableList[i]}" WHERE "guild id" = $1`,
              values: [guild]
            }
            await client.runQuery(query);
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
        const result = await client.runQuery(query);
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
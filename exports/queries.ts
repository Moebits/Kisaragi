import {Client, Message} from "discord.js";

module.exports = (client: Client, message: Message) => {

    const settings: any = require("./settings.js")(client, message);

    const Pool: any = require('pg').Pool;

    pgPool: new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      sslmode: process.env.PGSSLMODE,
      max: 15
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
    runQuery: async (query: any) => {
      const pgClient = await exports.pgPool.connect();
        let start: number = Date.now();
        try {
          const result = await pgClient.query(query);
          exports.logQuery(Object.values(query)[0], start);
          return result.rows;
        } catch(error) {
          console.log(error.stack); 
        } finally {
          pgClient.release();
        }
    }

    //Log Query
    logQuery: (text: string, start: number) => {
      let chalk: any = require("chalk");
      let moment: any = require("moment");
      const timestamp: string = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;
      const duration: number = Date.now() - start;
      let queryString: string = `${timestamp} Executed query ${text} in ${duration} ms`;
      console.log(chalk`{magentaBright ${queryString}}`);
    }

    //Fetch a row 
    fetchRow: async (table: string) => {
        let query: object = {
          text: `SELECT * FROM "${table}" WHERE "guild id" = ${message.guild.id}`,
          rowMode:'array'
        }
        const result: any = await exports.runQuery(query);
        return result[0];
    }

    //Fetch commands
    fetchCommand: async (command: string, column: string) => {
        let query: object = {
          text: `SELECT "${column}" FROM commands WHERE command IN ($1)`,
          values: [command],
          rowMode: 'array'
        };
        const result: any = await exports.runQuery(query);
        return result[0];
    }

    //Fetch aliases
    fetchAliases: async (command: string) => {
        let query: object = {
          text: `SELECT aliases FROM commands WHERE command IN ($1)`,
          values: [command],
          rowMode: 'array'
        }
        const result: any = await exports.runQuery(query);
        return result[0][0];
    }

    //Fetch Prefix
    fetchPrefix: async () => {
        let query: object = {
          text: `SELECT prefix FROM prefixes WHERE "guild id" = ${message.guild.id}`,
          rowMode: 'array'
        }
        const result: any = await exports.runQuery(query);
        return result[0][0];
    }

    //Fetch a column
    fetchColumn: async (table: string, column: string) => {
        let query: object = {
          text: `SELECT "${column}" FROM "${table}" WHERE "guild id" = ${message.guild.id}`,
          rowMode: 'array'
        }
        const result: any = await exports.runQuery(query);
        return result[0];
    }

    //Insert row into a table
    insertInto: async (table: string, column: string, value: any) => {
        let query: object = {
          text: `INSERT INTO "${table}" ("${column}") VALUES ($1)`,
          values: [value]
        }
        await exports.runQuery(query);
    }

    //Insert command
    insertCommand: async (command: string, aliases: string[], path: string) => {
      let query: object = {
        text: `INSERT INTO commands (command, aliases, path) VALUES ($1, $2, $3)`,
        values: [command, aliases, path]
      }
      await exports.runQuery(query);
  }

    //Update a row in a table
    updateColumn: async (table: string, column: string, value: any) => {
        let query: object = {
          text: `UPDATE "${table}" SET "${column}" = $1 WHERE "guild id" = ${message.guild.id}`,
          values: [value]
        }
        await exports.runQuery(query);
    }

    //Update Aliases
    updateAliases: async (command: string, aliases: any) => {
      let query: object = {
        text: `UPDATE commands SET aliases = $1 WHERE "command" = $2`,
        values: [aliases, command]
      }
      await exports.runQuery(query);
  }

    //Remove a guild from all tables
    deleteGuild: async (guild: number) => {
        for (let i = 0; i < tableList.length; i++) {
            let query: object = {
              text: `DELETE FROM "${tableList[i]}" WHERE "guild id" = $1`,
              values: [guild]
            }
            await exports.runQuery(query);
        }
    }

    //Order tables by guild member count
    orderTables: async () => {
        for (let table in tableList) {
            let query: object = {
              text: `SELECT members FROM "${tableList[table]}" ORDER BY 
              CASE WHEN "guild id" = '578604087763795970' THEN 0 ELSE 1 END, members DESC`
            }
            await exports.runQuery(query);
        }
    }

    //Init guild
    initGuild: async () => {
        let query: object = {
          text: `SELECT "guild id" FROM guilds`,
          rowMode: 'array'
        }
        const result = await exports.runQuery(query);
        const found = result.find((id: any) => id[0] === message.guild.id.toString());
        if (found === undefined || null) {
          for (let i in tableList) {
            await exports.insertInto(tableList[i], "guild id", message.guild.id);
          }
          await settings.initAll();
          await exports.orderTables();
        }
    }
}
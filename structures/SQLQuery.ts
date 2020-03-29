import bluebird from "bluebird"
import chalk from "chalk"
import {Message} from "discord.js"
import moment from "moment"
import {Pool, QueryArrayConfig, QueryConfig, QueryResult} from "pg"
import * as Redis from "redis"
import * as config from "../config.json"
import {Command} from "./Command"
import {Functions} from "./Functions"
import {Settings} from "./Settings"

const RedisAsync = bluebird.promisifyAll(Redis)
const redis = RedisAsync.createClient({
  url: process.env.REDIS_URL
}) as any
const pgPool = new Pool({
  connectionString: process.env.PG_URL,
  ssl: true,
  max: 2
})

const tableList = [
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
  "detection",
  "config"
]

export class SQLQuery {
  constructor(private readonly message: Message) {}

  // Run Query
  public static runQuery = async (query: QueryConfig | QueryArrayConfig, newData?: boolean): Promise<string[][]> => {
      const start = Date.now()
      let redisResult = null
      if (!newData) redisResult = await redis.getAsync(JSON.stringify(query)) as any
      if (redisResult) {
        // SQLQuery.logQuery(Object.values(query)[0], start, true)
        return (JSON.parse(redisResult))[0]
      } else {
        const pgClient = await pgPool.connect()
        try {
            const result: QueryResult<string[]> = await pgClient.query(query)
            // this.logQuery(Object.values(query)[0], start);
            await redis.setAsync(JSON.stringify(query), JSON.stringify(result.rows))
            return result.rows
          } catch (error) {
            console.log(error.stack)
            return [["Error"]]
          } finally {
            // @ts-ignore
            pgClient.release(true)
          }
      }
    }

  // Log Query
  public static logQuery = (text: any, start: number, blue?: boolean): void => {

      const duration = Date.now() - start
      const color = blue ? "cyanBright" : "magentaBright"
      const timestamp = `${moment().format("MM DD YYYY hh:mm:ss")} ->`

      const queryString = `${timestamp} Executed query ${text} in ${duration} ms`
      console.log(chalk`{${color} ${queryString}}`)
    }

  // Flush Redis DB
  public static flushDB = async (): Promise<void> => {
      await redis.flushdbAsync()
    }

  // Redis Set
  public redisSet = async (key: string, value: string, expiration?: number) => {
    if (expiration) {
      await redis.setAsync(key, value, "EX", expiration)
    } else {
      await redis.setAsync(key, value)
    }
  }

  // Redis Get
  public redisGet = async (key: string) => {
    const result = await redis.getAsync(key) as any
    return result
  }

  // Fetch a row
  public fetchRow = async (table: string, update?: boolean): Promise<string[]> => {
        const query: QueryArrayConfig = {
          text: `SELECT * FROM $1 WHERE "guild id" = $2`,
          rowMode:"array",
          values: [table, this.message.guild?.id]
        }
        const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query)
        return result[0]
    }

  // Fetch commands
  public static fetchCommand = async (command: string, column: string): Promise<string[]> => {
      const query: QueryArrayConfig = {
        text: `SELECT $1 FROM commands WHERE command IN ($2)`,
        values: [column, command],
        rowMode: "array"
      }
      const result = await SQLQuery.runQuery(query, true)
      return result[0]
  }

  // Fetch aliases
  public fetchAliases = async (update?: boolean): Promise<string[]> => {
        const query: QueryArrayConfig = {
          text: `SELECT aliases FROM commands`,
          rowMode: "array"
        }
        const result = await SQLQuery.runQuery(query, true)
        return result[0]
    }

  // Fetch Prefix
  public static fetchPrefix = async (message: Message, update?: boolean): Promise<string> => {
      if (!message.guild?.id) return "=>"
      const query: QueryArrayConfig = {
          text: `SELECT prefix FROM prefixes WHERE "guild id" = $1`,
          rowMode: "array",
          values: [message.guild?.id]
      }
      const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query)
      if (!result) {
          await SQLQuery.initGuild(message)
          return "=>"
        } else {
          return String(result[0])
        }
    }

  // Fetch a column
  public fetchColumn = async (table: string, column: string, key?: string | boolean, value?: string | boolean, update?: boolean): Promise<any> => {
      const query: QueryArrayConfig = key ? {
        text: `SELECT $1 FROM $2 WHERE $3 = $4`,
        rowMode: "array",
        values: [column, table, key, value]
      } : {
        text: `SELECT $1 FROM $2 WHERE "guild id" = $3`,
        rowMode: "array",
        values: [column, table, this.message.guild?.id]
      }
      const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query, true)
      const data = result?.[0]?.[0]
      if (data) {
        if (data === "[]" || data === "{}") return null
        return JSON.parse(JSON.stringify(data))
      }
      return null
    }

  // Select whole column
  public selectColumn = async (table: string, column: string, update?: boolean): Promise<string[]> => {
      const query: QueryArrayConfig = {
        text: `SELECT $1 FROM $2`,
        rowMode: "array",
        values: [column, table]
      }
      const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query, true)
      return result as any as string[]
    }

  // Insert row into a table
  public static insertInto = async (table: string, column: string, value: any): Promise<void> => {
        const query: QueryConfig = {
          text: `INSERT INTO $1 ($2) VALUES ($3)`,
          values: [table, column, value]
        }
        await SQLQuery.runQuery(query, true)
    }

  // Insert command
  public static insertCommand = async (name: string, path: string, command: Command): Promise<void> => {
    const cmd = command.options
    const query: QueryConfig = {
        text: `INSERT INTO commands (command, aliases, path, cooldown, help, examples, "guild only", random, permission, "bot permission") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        values: [name, cmd.aliases, path, cmd.cooldown, cmd.help, cmd.examples, cmd.guildOnly, cmd.random, cmd.permission, cmd.botPermission]
      }
    await SQLQuery.runQuery(query, true)
  }

  // Update Prefix
  public static updatePrefix = async (message: Message, prefix: string): Promise<void> => {
    const query: QueryConfig = {
        text: `UPDATE "prefixes" SET "prefix" = $1 WHERE "guild id" = $2`,
        values: [prefix, message.guild?.id]
      }
    await SQLQuery.runQuery(query, true)
    SQLQuery.fetchPrefix(message, true)
}

  // Update a row in a table
  public updateColumn = async (table: string, column: string, value: any, key?: string, keyVal?: string): Promise<void> => {
        let query: QueryConfig
        if (key) {
          query = {
            text: `UPDATE $1 SET $2 = $4 WHERE $3 = $5`,
            values: [table, column, key, value, keyVal]
          }
        } else {
          query = {
            text: `UPDATE $1 SET $2 = $3 WHERE "guild id" = $4`,
            values: [table, column, value, this.message.guild?.id]
          }
        }
        await SQLQuery.runQuery(query, true)
    }

  // Update Command
  public static updateCommand = async (name: string, path: string, command: Command): Promise<void> => {
    const cmd = command.options
    const query: QueryConfig = {
      text: `UPDATE commands SET aliases = $2, cooldown = $3, help = $4, examples = $5, "guild only" = $6, random = $7, permission = $8, "bot permission" = $9, path = $10 WHERE "command" = $1`,
      values: [name, cmd.aliases, cmd.cooldown, cmd.help, cmd.examples, cmd.guildOnly, cmd.random, cmd.permission, cmd.botPermission, path]
    }
    await SQLQuery.runQuery(query, true)
  }

  // Remove a guild from all tables
  public static deleteGuild = async (guildID: string): Promise<void> => {
        for (let i = 0; i < tableList.length; i++) {
          if (tableList[i] === "points") continue
          const query: QueryConfig = {
            text: `DELETE FROM $1 WHERE "guild id" = $2`,
            values: [tableList[i], guildID]
          }
          await SQLQuery.runQuery(query, true)
        }
    }

  // Delete row
  public static deleteRow = async (table: string, column: string, value: any): Promise<void> => {
      const query: QueryConfig = {
        text: `DELETE FROM $1 WHERE $2 = $3`,
        values: [table, column, value]
      }
      await SQLQuery.runQuery(query, true)
    }

  /** Deletes a table. */
  public static purgeTable = async (table: string): Promise<void> => {
      if (table === "points") return
      const query: QueryConfig = {
        text: `DELETE FROM $1`,
        values: [table]
      }
      await SQLQuery.runQuery(query, true)
    }

  // Order tables by guild member count
  public static orderTables = async (): Promise<void> => {
        for (let i = 0; i < tableList.length; i++) {
            const query: QueryConfig = {
              text: `SELECT members FROM $1 ORDER BY
              CASE WHEN "guild id" = '578604087763795970' THEN 0 ELSE 1 END, members DESC`,
              values: [tableList[i]]
            }
            await SQLQuery.runQuery(query, true)
        }
    }

  /** Init Guild */
  public static initGuild = async (message: Message) => {
    const settings = new Settings(message)
    const query: QueryArrayConfig = {
          text: `SELECT "guild id" FROM guilds`,
          rowMode: "array"
    }
    const result = await SQLQuery.runQuery(query, true)
    const found = result.find((id: string[]) => id[0] === message.guild?.id.toString()) as any
    if (!found) {
          for (let i = 0; i < tableList.length; i++) {
            await SQLQuery.insertInto(tableList[i], "guild id", message.guild?.id)
          }
          await settings.initAll()
          await SQLQuery.orderTables()
    }
    return
  }

  /** Gets all tables. */
  public static getTables = async () => {
    const query: QueryConfig = {
      text: `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' AND table_schema = 'public' ORDER BY table_name`
    }
    const result = await SQLQuery.runQuery(query, true) as any
    return result.map((r: any) => r.table_name) as string[]
  }

  /** Deletes all rows from all tables. */
  public static purgeDB = async () => {
    for (let i = 0; i < tableList.length; i++) {
      if (tableList[i] === "points") continue
      await SQLQuery.purgeTable(tableList[i])
    }
    return
  }

  /** Sets foreign keys. */
  public static foreignKeys = async (table: string) => {
    const query: QueryConfig = {
      text: `ALTER TABLE $1 ADD FOREIGN KEY ("guild id") REFERENCES guilds ("guild id")`,
      values: [table]
    }
    await SQLQuery.runQuery(query, true)
  }
}

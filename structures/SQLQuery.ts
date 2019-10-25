import bluebird from "bluebird"
import chalk from "chalk"
import {Message} from "discord.js"
import moment from "moment"
import {Pool, QueryArrayConfig, QueryConfig, QueryResult} from "pg"
import * as Redis from "redis"
import {Settings} from "./Settings"

const RedisAsync = bluebird.promisifyAll(Redis)
const redis = RedisAsync.createClient()
const pgPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
  ssl: Boolean(process.env.PGSSLMODE),
  max: 10
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
  "reaction",
  "config"
]

export class SQLQuery {
  constructor(private readonly message: Message) {}

  // Run Query
  public static runQuery = async (query: QueryConfig | QueryArrayConfig, newData?: boolean): Promise<string[][]> => {
      const start = Date.now()
      let redisResult = await redis.getAsync(JSON.stringify(query))
      if (newData) redisResult = null
      if (redisResult) {
        SQLQuery.logQuery(Object.values(query)[0], start, true)
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
            pgClient.release(true)
          }
      }
    }

  // Log Query
  public static logQuery = (text: string, start: number, blue?: boolean): void => {

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
    const result = await redis.getAsync(key)
    return result
  }

  // Fetch a row
  public fetchRow = async (table: string, update?: boolean): Promise<string[]> => {
        const query: QueryArrayConfig = {
          text: `SELECT * FROM "${table}" WHERE "guild id" = ${this.message.guild!.id}`,
          rowMode:"array"
        }
        const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query)
        return result[0]
    }

  // Fetch commands
  public static fetchCommand = async (command: string, column: string): Promise<string[]> => {
      const query: QueryArrayConfig = {
        text: `SELECT "${column}" FROM commands WHERE command IN ($1)`,
        values: [command],
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
  public static fetchPrefix = async (message: Message, update?: boolean): Promise<string[]> => {
        const query: QueryArrayConfig = {
          text: `SELECT prefix FROM prefixes WHERE "guild id" = ${message.guild!.id}`,
          rowMode: "array"
        }
        const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query)
        if (!result) return ["=>"]
        return result[0]
    }

  // Fetch a column
  public fetchColumn = async (table: string, column: string, key?: string | boolean, value?: string | boolean, update?: boolean): Promise<string[]> => {
      const query: QueryArrayConfig = key ? {
        text: `SELECT "${column}" FROM "${table}" WHERE "${key}" = ${value}`,
        rowMode: "array"
      } : {
        text: `SELECT "${column}" FROM "${table}" WHERE "guild id" = ${this.message.guild!.id}`,
        rowMode: "array"
      }
      const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query, true)
      return result[0]
    }

  // Select whole column
  public selectColumn = async (table: string, column: string, update?: boolean): Promise<string[]> => {
      const query: QueryArrayConfig = {
        text: `SELECT "${column}" FROM "${table}"`,
        rowMode: "array"
      }
      const result = update ? await SQLQuery.runQuery(query, true) : await SQLQuery.runQuery(query, true)
      return result as unknown as string[]
    }

  // Insert row into a table
  public insertInto = async (table: string, column: string, value: unknown): Promise<void> => {
        const query: QueryConfig = {
          text: `INSERT INTO "${table}" ("${column}") VALUES ($1)`,
          values: [value]
        }
        await SQLQuery.runQuery(query, true)
    }

  // Insert command
  public static insertCommand = async (command: string, aliases: string[], path: string, cooldown: string): Promise<void> => {
      const query: QueryConfig = {
        text: `INSERT INTO commands (command, aliases, path, cooldown) VALUES ($1, $2, $3, $4)`,
        values: [command, aliases, path, cooldown]
      }
      await SQLQuery.runQuery(query, true)
  }

  // Update Prefix
  public static updatePrefix = async (message: Message, prefix: string): Promise<void> => {
    const query: QueryConfig = {
        text: `UPDATE "prefixes" SET "prefix" = $1 WHERE "guild id" = ${message.guild!.id}`,
        values: [prefix]
      }
    await SQLQuery.runQuery(query, true)
    SQLQuery.fetchPrefix(message, true)
}

  // Update a row in a table
  public updateColumn = async (table: string, column: string, value: unknown, key?: string, keyVal?: string): Promise<void> => {
        let query: QueryConfig
        if (key) {
          query = {
            text: `UPDATE "${table}" SET "${column}" = $1 WHERE "${key}" = $2`,
            values: [value, keyVal]
          }
        } else {
          query = {
            text: `UPDATE "${table}" SET "${column}" = $1 WHERE "guild id" = ${this.message.guild!.id}`,
            values: [value]
          }
        }
        await SQLQuery.runQuery(query, true)
    }

  // Update Command
  public static updateCommand = async (command: string, aliases: string[], cooldown: string): Promise<void> => {
      const query: QueryConfig = {
        text: `UPDATE commands SET aliases = $1, cooldown = $2 WHERE "command" = $3`,
        values: [aliases, cooldown, command]
      }
      await SQLQuery.runQuery(query, true)
  }

  // Remove a guild from all tables
  public deleteGuild = async (guildID: string): Promise<void> => {
        for (let i = 0; i < tableList.length; i++) {
            const query: QueryConfig = {
              text: `DELETE FROM "${tableList[i]}" WHERE "guild id" = $1`,
              values: [guildID]
            }
            await SQLQuery.runQuery(query, true)
        }
    }

  // Delete row
  public deleteRow = async (table: string, column: string, value: unknown): Promise<void> => {
      const query: QueryConfig = {
        text: `DELETE FROM ${table} WHERE ${column} = $1`,
        values: [value]
      }
      await SQLQuery.runQuery(query, true)
    }

  // Purge Table
  public purgeTable = async (table: string): Promise<void> => {
      const query: QueryConfig = {
        text: `DELETE FROM ${table}`
      }
      await SQLQuery.runQuery(query, true)
    }

  // Order tables by guild member count
  public static orderTables = async (): Promise<void> => {
        for (let i = 0; i < tableList.length; i++) {
            const query: QueryConfig = {
              text: `SELECT members FROM "${tableList[i]}" ORDER BY
              CASE WHEN "guild id" = '578604087763795970' THEN 0 ELSE 1 END, members DESC`
            }
            await SQLQuery.runQuery(query, true)
        }
    }

  // Init guild
  public initGuild = async () => {
      const settings = new Settings(this.message)
      const query: QueryArrayConfig = {
            text: `SELECT "guild id" FROM guilds`,
            rowMode: "array"
          }
      const result = await SQLQuery.runQuery(query, true)
      const found = result.find((id: string[]) => id[0] === this.message.guild!.id.toString())
      if (!found) {
            for (let i = 0; i < tableList.length; i++) {
              await this.insertInto(tableList[i], "guild id", this.message.guild!.id)
            }
            await settings.initAll()
            await SQLQuery.orderTables()
          }
      return
      }
}

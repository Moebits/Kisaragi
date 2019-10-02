"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const chalk_1 = __importDefault(require("chalk"));
const moment_1 = __importDefault(require("moment"));
const pg_1 = require("pg");
const Redis = __importStar(require("redis"));
const Settings_1 = require("./Settings");
const RedisAsync = bluebird_1.default.promisifyAll(Redis);
const redis = RedisAsync.createClient();
const pgPool = new pg_1.Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: Number(process.env.PGPORT),
    ssl: Boolean(process.env.PGSSLMODE),
    max: 10
});
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
    "reaction"
];
class SQLQuery {
    constructor(message) {
        this.message = message;
        // Fetch a row
        this.fetchRow = (table, update) => __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT * FROM "${table}" WHERE "guild id" = ${this.message.guild.id}`,
                rowMode: "array"
            };
            const result = update ? yield SQLQuery.runQuery(query, true) : yield SQLQuery.runQuery(query);
            return result[0];
        });
        // Fetch aliases
        this.fetchAliases = (update) => __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT aliases FROM commands`,
                rowMode: "array"
            };
            const result = yield SQLQuery.runQuery(query, true);
            return result[0];
        });
        // Fetch a column
        this.fetchColumn = (table, column, key, value, update) => __awaiter(this, void 0, void 0, function* () {
            const query = key ? {
                text: `SELECT "${column}" FROM "${table}" WHERE "${key}" = ${value}`,
                rowMode: "array"
            } : {
                text: `SELECT "${column}" FROM "${table}" WHERE "guild id" = ${this.message.guild.id}`,
                rowMode: "array"
            };
            const result = update ? yield SQLQuery.runQuery(query, true) : yield SQLQuery.runQuery(query);
            return result[0];
        });
        // Select whole column
        this.selectColumn = (table, column, update) => __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT "${column}" FROM "${table}"`,
                rowMode: "array"
            };
            const result = update ? yield SQLQuery.runQuery(query, true) : yield SQLQuery.runQuery(query, false);
            return result[0];
        });
        // Insert row into a table
        this.insertInto = (table, column, value) => __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `INSERT INTO "${table}" ("${column}") VALUES ($1)`,
                values: [value]
            };
            yield SQLQuery.runQuery(query, true);
        });
        // Update a row in a table
        this.updateColumn = (table, column, value, key, keyVal) => __awaiter(this, void 0, void 0, function* () {
            let query;
            if (key) {
                query = {
                    text: `UPDATE "${table}" SET "${column}" = $1 WHERE "${key}" = $2`,
                    values: [value, keyVal]
                };
            }
            else {
                query = {
                    text: `UPDATE "${table}" SET "${column}" = $1 WHERE "guild id" = ${this.message.guild.id}`,
                    values: [value]
                };
            }
            yield SQLQuery.runQuery(query, true);
            this.selectColumn(table, column, true);
            if (key) {
                yield this.fetchColumn(table, column, key, keyVal, true);
            }
            else {
                yield this.fetchColumn(table, column, false, false, true);
                this.fetchRow(table, true);
            }
        });
        // Remove a guild from all tables
        this.deleteGuild = (guildID) => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tableList.length; i++) {
                const query = {
                    text: `DELETE FROM "${tableList[i]}" WHERE "guild id" = $1`,
                    values: [guildID]
                };
                yield SQLQuery.runQuery(query, true);
            }
        });
        // Delete row
        this.deleteRow = (table, column, value) => __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `DELETE FROM ${table} WHERE ${column} = $1`,
                values: [value]
            };
            yield SQLQuery.runQuery(query, true);
        });
        // Purge Table
        this.purgeTable = (table) => __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `DELETE FROM ${table}`
            };
            yield SQLQuery.runQuery(query, true);
        });
        // Init guild
        this.initGuild = () => __awaiter(this, void 0, void 0, function* () {
            const settings = new Settings_1.Settings(this.message);
            const query = {
                text: `SELECT "guild id" FROM guilds`,
                rowMode: "array"
            };
            const result = yield SQLQuery.runQuery(query, true);
            const found = result.find((id) => id[0] === this.message.guild.id.toString());
            if (!found) {
                for (let i = 0; i < tableList.length; i++) {
                    yield this.insertInto(tableList[i], "guild id", this.message.guild.id);
                }
                yield settings.initAll();
                yield SQLQuery.orderTables();
            }
            return;
        });
    }
}
exports.SQLQuery = SQLQuery;
// Run Query
SQLQuery.runQuery = (query, newData) => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    let redisResult = yield redis.getAsync(JSON.stringify(query));
    if (newData)
        redisResult = null;
    if (redisResult) {
        SQLQuery.logQuery(Object.values(query)[0], start, true);
        return (JSON.parse(redisResult))[0];
    }
    else {
        const pgClient = yield pgPool.connect();
        try {
            const result = yield pgClient.query(query);
            // this.logQuery(Object.values(query)[0], start);
            yield redis.setAsync(JSON.stringify(query), JSON.stringify(result.rows));
            return result.rows;
        }
        catch (error) {
            console.log(error.stack);
            return [["Error"]];
        }
        finally {
            pgClient.release(true);
        }
    }
});
// Log Query
SQLQuery.logQuery = (text, start, blue) => {
    const duration = Date.now() - start;
    const color = blue ? "cyanBright" : "magentaBright";
    const timestamp = `${moment_1.default().format("MM DD YYYY hh:mm:ss")} ->`;
    const queryString = `${timestamp} Executed query ${text} in ${duration} ms`;
    console.log(chalk_1.default `{${color} ${queryString}}`);
};
// Flush Redis DB
SQLQuery.flushDB = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.flushdbAsync();
});
// Fetch commands
SQLQuery.fetchCommand = (command, column) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        text: `SELECT "${column}" FROM commands WHERE command IN ($1)`,
        values: [command],
        rowMode: "array"
    };
    const result = yield SQLQuery.runQuery(query, true);
    return result[0];
});
// Fetch Prefix
SQLQuery.fetchPrefix = (message, update) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        text: `SELECT prefix FROM prefixes WHERE "guild id" = ${message.guild.id}`,
        rowMode: "array"
    };
    const result = update ? yield SQLQuery.runQuery(query, true) : yield SQLQuery.runQuery(query);
    if (!result.join(""))
        return ["=>"];
    return result[0];
});
// Insert command
SQLQuery.insertCommand = (command, aliases, path, cooldown) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        text: `INSERT INTO commands (command, aliases, path, cooldown) VALUES ($1, $2, $3, $4)`,
        values: [command, aliases, path, cooldown]
    };
    yield SQLQuery.runQuery(query, true);
});
// Update Prefix
SQLQuery.updatePrefix = (message, prefix) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        text: `UPDATE "prefixes" SET "prefix" = $1 WHERE "guild id" = ${message.guild.id}`,
        values: [prefix]
    };
    yield SQLQuery.runQuery(query, true);
    SQLQuery.fetchPrefix(message, true);
});
// Update Command
SQLQuery.updateCommand = (command, aliases, cooldown) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        text: `UPDATE commands SET aliases = $1, cooldown = $2 WHERE "command" = $3`,
        values: [aliases, cooldown, command]
    };
    yield SQLQuery.runQuery(query, true);
});
// Order tables by guild member count
SQLQuery.orderTables = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < tableList.length; i++) {
        const query = {
            text: `SELECT members FROM "${tableList[i]}" ORDER BY
              CASE WHEN "guild id" = '578604087763795970' THEN 0 ELSE 1 END, members DESC`
        };
        yield SQLQuery.runQuery(query, true);
    }
});
//# sourceMappingURL=SQLQuery.js.map
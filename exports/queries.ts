module.exports = (client: any, message: any) => {

    const database = require('../database.js');

    const tableList: string[] = [
        "birthdays",
        "blocks",
        "channels",
        "commands",
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

    //Fetch a row 
    client.fetchRow = async (table: string) => {
        let query: string = `SELECT * FROM ${table} WHERE guild id = ${message.guild.id}`;
        try {
            const result: string[] = await database.query(query);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch commands
    client.fetchCommand = async (command: string) => {
        let query: string = `SELECT command FROM commands WHERE command = ${command}`;
        try {
            const result: string[] = await database.query(query);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch aliases
    client.fetchAliases = async (command: string) => {
        let query: string = `SELECT aliases FROM commands WHERE command = ${command}`;
        try {
            const result: string[] = await database.query(query);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch Prefix
    client.fetchPrefix = async (command: string) => {
        let query: string = `SELECT aliases FROM commands WHERE command = ${command}`;
        try {
            const result: string[] = await database.query(query);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch a column
    client.fetchColumn = async (table: string, column: string) => {
        let query: string = `SELECT ${column} FROM ${table} WHERE guild id = ${message.guild.id}`;
        try {
            const result: string[] = await database.query(query);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Insert row into a table
    client.insertInto = async (table: string, column: string, value: string) => {
        let query: string = `INSERT INTO ${table} (${column}) VALUES (${value})`;
        try {
            await database.query(query);
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Update a row in a table
    client.updateColumn = async (table: string, column: string, value: string) => {
        let query: string = `UPDATE ${table} SET ${column} = ${value} WHERE guild id = ${message.guild.id}`;
        try {
            await database.query(query);
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Remove a guild from all tables
    client.deleteGuild = async (guild: number) => {
        try {
            for (let table in tableList) {
                let query: string = `DELETE FROM ${table} WHERE guild id = ${guild}`;
                await database.query(query);
            }
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Order tables by guild member count
    client.orderTables = async () => {
        try {
            for (let table in tableList) {
                let query: string = `SELECT members FROM ${table} ORDER BY members DESC`;
                await database.query(query);
            }
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch guild
    client.fetchGuild = async () => {
        let query: string = `SELECT guild id FROM guilds RETURNING *`;
        try {
            const result: string[] = await database.query(query);
            for (let guild in result) {
                if (message.guild.id === guild) {
                    return true;
                } else {
                    return false;
                }
            }
          } catch(error) {
            console.log(error.stack)
          }
    }
}
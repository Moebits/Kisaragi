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
        let query: string = `SELECT * FROM $1 WHERE guild id = $2;`;
        let queryValues = [table, message.guild.id];
        try {
            const result: string[] = await database.query(query, queryValues);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch commands
    client.fetchCommand = async (command: string) => {
        let query: string = `SELECT command FROM commands WHERE command = $1;`;
        let queryValues = [command];
        try {
            const result: string[] = await database.query(query, queryValues);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch aliases
    client.fetchAliases = async (command: string) => {
        let query: string = `SELECT aliases FROM commands WHERE command = $1;`;
        let queryValues = [command];
        try {
            const result: string[] = await database.query(query, queryValues);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch Prefix
    client.fetchPrefix = async () => {
        let query: string = `SELECT prefix FROM prefixes WHERE guild id = $1;`;
        let queryValues = [message.guild.id];
        try {
            const result: string = await database.query(query, queryValues);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch a column
    client.fetchColumn = async (table: string, column: string) => {
        let query: string = `SELECT $1 FROM $2 WHERE guild id = $3;`;
        let queryValues = [column, table, message.guild.id];
        try {
            const result: string[] = await database.query(query, queryValues);
            return result;
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Insert row into a table
    client.insertInto = async (table: string, column: string, value: any) => {
        let query: string = `INSERT INTO $1($2) VALUES($3) WHERE guild id = $4;`;
        let queryValues = [table, column, value, message.guild.id];
        try {
            await database.query(query, queryValues);
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Insert command
    client.insertCommand = async (command: string, path: string) => {
      let query: string = `INSERT INTO commands (command, path) VALUES ($1, $2);`;
      let queryValues = [command, path];
      try {
          await database.query(query, queryValues);
        } catch(error) {
          console.log(error.stack)
        }
  }

    //Update a row in a table
    client.updateColumn = async (table: string, column: string, value: string) => {
        let query: string = `UPDATE $1 SET $2 = $3 WHERE guild id = $4;`;
        let queryValues = [table, column, value, message.guild.id];
        try {
            await database.query(query, queryValues);
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Remove a guild from all tables
    client.deleteGuild = async (guild: number) => {
        try {
            for (let table in tableList) {
                let query: string = `DELETE FROM $1 WHERE guild id = $2;`;
                let queryValues = [table, guild];
                await database.query(query, queryValues);
            }
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Order tables by guild member count
    client.orderTables = async () => {
        try {
            for (let table in tableList) {
                let query: string = `SELECT members FROM $1 ORDER BY members DESC;`;
                let queryValues = [table];
                await database.query(query, queryValues);
            }
          } catch(error) {
            console.log(error.stack)
          }
    }

    //Fetch guild
    client.fetchGuild = async () => {
        let query: string = `SELECT guild id FROM guilds RETURNING *;`;
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
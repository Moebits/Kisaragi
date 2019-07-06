const {Pool}: any = require('pg');
const connectionString = process.env.HEROKU_URI;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

let chalk: any = require("chalk");
let moment: any = require("moment");
const timestamp: string = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;

module.exports = {

  query: (text: string, params: string[]) => { 
    pool.query(text, params); 
  }

  /*
  query: (text: string, params: string[], callback: any) => {
    const start: number = Date.now();
    return pool.query(text, params, (error: any, resolve: any) => {
      const duration: number = Date.now() - start;
      let queryString: string = `${timestamp} Executed query ${text} ${duration} Rows: ${resolve.rowCount}`;
      console.log(chalk`{magentaBright${queryString}}`);
      callback(error, resolve);
    });
  }
  */

}
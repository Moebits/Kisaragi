const {Pool}: any = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  sslmode: process.env.PGSSLMODE
});

let chalk: any = require("chalk");
let moment: any = require("moment");
const timestamp: string = `${moment().format("MM DD YYYY hh:mm:ss")} ->`;

module.exports = {

  query: (text: string, params: string[]) => {
    const start: number = Date.now();
    pool.query(text, params, () => {
      const duration: number = Date.now() - start
      let queryString: string = `${timestamp} Executed query ${text} in ${duration} ms`
      console.log(chalk`{magentaBright ${queryString}}`)
    })
  }
}
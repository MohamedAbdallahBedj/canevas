const Pool = require("pg").Pool;

const devConfig = {
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  ssl: process.env.DATABASE_SSL === `true`
}

const pool = new Pool(devConfig);



module.exports = pool;
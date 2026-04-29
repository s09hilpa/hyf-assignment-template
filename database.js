
import knex from "knex";

const dbFile = "./hyf_node_week1.db";

const db = knex({
  client: "sqlite3",
  connection: {
    filename: dbFile,
  },
  useNullAsDefault: true,
});

export default db;
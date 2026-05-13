import knex from "knex";

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./hyf_node_week1.db",
  },
  useNullAsDefault: true,
});

export default db;

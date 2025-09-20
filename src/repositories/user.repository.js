import pool from "../db/db.js";
import { Queries } from "../db/queries.js";

export const UserRepository = {
  create: async (name, email) => {
    const result = await pool.query(Queries.users.insert, [name, email]);
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query(Queries.users.findAll);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(Queries.users.findById, [id]);
    return result.rows[0];
  },

  update: async (id, name, email) => {
    const result = await pool.query(Queries.users.update, [name, email, id]);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(Queries.users.delete, [id]);
    return result.rows[0]; // return deleted record
  },
};

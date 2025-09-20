import pool from "../db/db.js";
import { Queries } from "../db/queries.js";

export const SubjectRepository = {
  create: async (name, code, description, is_active = true) => {
    const result = await pool.query(Queries.subjects.insert, [
      name,
      code,
      description,
      is_active,
    ]);
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query(Queries.subjects.findAll);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(Queries.subjects.findById, [id]);
    return result.rows[0];
  },

  update: async (id, name, code, description, is_active) => {
    const result = await pool.query(Queries.subjects.update, [
      name,
      code,
      description,
      is_active,
      id,
    ]);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(Queries.subjects.delete, [id]);
    return result.rows[0];
  },
};

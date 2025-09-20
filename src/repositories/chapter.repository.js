import pool from "../db/db.js";
import { Queries } from "../db/queries.js";

export const ChapterRepository = {
  create: async (subjectId, name, code, description, isActive = true) => {
    const result = await pool.query(Queries.chapters.insert, [
      subjectId,
      name,
      code,
      description,
      isActive,
    ]);
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query(Queries.chapters.findAll);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(Queries.chapters.findById, [id]);
    return result.rows[0];
  },

  findBySubjectId: async (subjectId) => {
    const result = await pool.query(Queries.chapters.findBySubjectId, [
      subjectId,
    ]);
    return result.rows;
  },

  update: async (id, subjectId, name, code, description, isActive) => {
    const result = await pool.query(Queries.chapters.update, [
      subjectId,
      name,
      code,
      description,
      isActive,
      id,
    ]);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(Queries.chapters.delete, [id]);
    return result.rows[0];
  },
};

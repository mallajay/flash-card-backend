import pool from "../db/db.js";
import { Queries } from "../db/queries.js";

export const ChapterTopicRepository = {
  insert: async (
    subject_id,
    chapter_id,
    name,
    description,
    is_active = true
  ) => {
    const result = await pool.query(Queries.chapter_topic.insert, [
      subject_id,
      chapter_id,
      name,
      description,
      is_active,
    ]);
    return result.rows[0];
  },

  bulkInsert: async (topics) => {
    if (!topics.data.length) return [];
    const { text, values } = Queries.chapter_topic.bulkInsert(topics);
    const result = await pool.query(text, values);
    return result.rows;
  },

  findAll: async () => {
    const result = await pool.query(Queries.chapter_topic.findAll);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(Queries.chapter_topic.findById, [id]);
    return result.rows[0];
  },

  update: async (id, subject_id, chapter_id, name, description, is_active) => {
    const result = await pool.query(Queries.chapter_topic.update, [
      subject_id,
      chapter_id,
      name,
      description,
      is_active,
      id,
    ]);
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(Queries.chapter_topic.delete, [id]);
    return result.rows[0];
  },

  findByChapterId: async (chapter_id) => {
    const result = await pool.query(Queries.chapter_topic.findByChapterId, [
      chapter_id,
    ]);
    return result.rows;
  },

  findBySubjectId: async (subject_id) => {
    const result = await pool.query(Queries.chapter_topic.findBySubjectId, [
      subject_id,
    ]);
    return result.rows;
  },

  findAllWithDetails: async () => {
    const result = await pool.query(Queries.chapter_topic.findAllWithDetails);
    return result.rows;
  },

  findGroupedByChapter: async (chapterId) => {
    const result = await pool.query(
      Queries.chapter_topic.findGroupedByChapter,
      [chapterId]
    );

    return result.rows; // one row since filtered by chapter
  },
};

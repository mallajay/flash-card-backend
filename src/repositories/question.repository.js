import pool from "../db/db.js";
import { Queries } from "../db/queries.js";

export const QuestionRepository = {
  create: async (data) => {
    const {
      subject_id,
      chapter_id,
      topic_id,
      subtopic,
      question,
      explanation,
      type,
      difficulty,
      options,
      supporting_picture,
    } = data;

    const result = await pool.query(Queries.questions.insert, [
      subject_id,
      chapter_id,
      topic_id,
      subtopic,
      question,
      explanation,
      type,
      difficulty,
      JSON.stringify(options), // store options as JSON
      supporting_picture,
    ]);

    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query(Queries.questions.findAll);
    return result.rows;
  },

  findByTopicId: async (topic_id) => {
    const result = await pool.query(Queries.questions.findByTopicId, [
      topic_id,
    ]);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(Queries.questions.findById, [id]);
    return result.rows[0];
  },

  deleteById: async (id) => {
    const result = await pool.query(Queries.questions.deleteById, [id]);
    return result.rows[0];
  },
};

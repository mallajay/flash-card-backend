import { SubjectRepository } from "../repositories/subject.repository.js";
import pool from "../db/db.js";

export const SubjectController = {
  create: async (req, res) => {
    try {
      const { name, code, description, is_active } = req.body;
      const subject = await SubjectRepository.create(
        name,
        code,
        description,
        is_active ?? true
      );
      res.status(201).json(subject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const subjects = await SubjectRepository.findAll();
      res.json(subjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectRepository.findById(id);
      if (!subject) return res.status(404).json({ error: "Subject not found" });
      res.json(subject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, code, description, is_active } = req.body;
      const subject = await SubjectRepository.update(
        id,
        name,
        code,
        description,
        is_active
      );
      if (!subject) return res.status(404).json({ error: "Subject not found" });
      res.json(subject);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      // 🔹 Check if subject is used in chapters
      const chapterCheck = await pool.query(
        `SELECT COUNT(*) FROM chapters WHERE subject_id = $1`,
        [id]
      );

      if (parseInt(chapterCheck.rows[0].count, 10) > 0) {
        return res.status(400).json({
          error: "Cannot delete subject. It is being used in chapters.",
        });
      }

      // 🔹 Check if subject is used in topics
      const topicCheck = await pool.query(
        `SELECT COUNT(*) FROM chapter_topic WHERE subject_id = $1`,
        [id]
      );

      if (parseInt(topicCheck.rows[0].count, 10) > 0) {
        return res.status(400).json({
          error: "Cannot delete subject. It is being used in topics.",
        });
      }

      // 🔹 If no references, delete subject
      const subject = await SubjectRepository.delete(id);

      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }

      res.json({
        message: "Subject deleted successfully",
        subject,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

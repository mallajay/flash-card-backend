import { ChapterTopicRepository } from "../repositories/chapterTopic.repository.js";

export const ChapterTopicController = {
  create: async (req, res) => {
    try {
      const { subject_id, chapter_id, name, description, is_active } = req.body;
      const topic = await ChapterTopicRepository.insert(
        subject_id,
        chapter_id,
        name,
        description,
        is_active
      );
      res.status(201).json(topic);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create topic" });
    }
  },

  bulkCreate: async (req, res) => {
    try {
      const topics = req.body; // expect array of topics
      console.log("topics", topics);
      const result = await ChapterTopicRepository.bulkInsert(topics);
      res.status(201).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to bulk insert topics" });
    }
  },

  getAll: async (req, res) => {
    try {
      const topics = await ChapterTopicRepository.findAll();
      res.json(topics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const topic = await ChapterTopicRepository.findById(id);
      if (!topic) return res.status(404).json({ error: "Topic not found" });
      res.json(topic);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { subject_id, chapter_id, name, description, is_active } = req.body;
      const topic = await ChapterTopicRepository.update(
        id,
        subject_id,
        chapter_id,
        name,
        description,
        is_active
      );
      if (!topic) return res.status(404).json({ error: "Topic not found" });
      res.json(topic);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update topic" });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const topic = await ChapterTopicRepository.delete(id);
      if (!topic) return res.status(404).json({ error: "Topic not found" });
      res.json({ message: "Topic deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete topic" });
    }
  },

  getByChapterId: async (req, res) => {
    try {
      const { chapter_id } = req.params;
      const topics = await ChapterTopicRepository.findByChapterId(chapter_id);
      res.json(topics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch topics by chapter" });
    }
  },

  getBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const topics = await ChapterTopicRepository.findBySubjectId(subject_id);
      res.json(topics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch topics by subject" });
    }
  },

  getAllWithDetails: async (req, res) => {
    try {
      console.log("first");
      const topics = await ChapterTopicRepository.findAllWithDetails();
      res.json(topics);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  },

  getGroupedByChapter: async (req, res) => {
    try {
      const { chapter_id } = req.params;
      const data = await ChapterTopicRepository.findGroupedByChapter(
        chapter_id
      );
      if (!data) {
        return res.status(404).json({ error: "Chapter not found" });
      }
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch grouped topics" });
    }
  },
};

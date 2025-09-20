import { ChapterRepository } from "../repositories/chapter.repository.js";

export const ChapterController = {
  create: async (req, res) => {
    try {
      const { subjectId, name, code, description, isActive } = req.body;
      const chapter = await ChapterRepository.create(
        subjectId,
        name,
        code,
        description,
        isActive ?? true
      );
      res.status(201).json(chapter);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const chapters = await ChapterRepository.findAll();
      res.json(chapters);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterRepository.findById(id);
      if (!chapter) return res.status(404).json({ error: "Chapter not found" });
      res.json(chapter);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  findBySubjectId: async (req, res) => {
    try {
      const { subjectId } = req.params;
      const chapters = await ChapterRepository.findBySubjectId(subjectId);
      res.json(chapters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { subjectId, name, code, description, isActive } = req.body;
      const chapter = await ChapterRepository.update(
        id,
        subjectId,
        name,
        code,
        description,
        isActive
      );
      if (!chapter) return res.status(404).json({ error: "Chapter not found" });
      res.json(chapter);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterRepository.delete(id);
      if (!chapter) return res.status(404).json({ error: "Chapter not found" });
      res.json({ message: "Chapter deleted", chapter });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

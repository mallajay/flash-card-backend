import { QuestionRepository } from "../repositories/question.repository.js";

export const QuestionController = {
  createQuestion: async (req, res) => {
    try {
      const data = req.body;
      const question = await QuestionRepository.create(data);
      res.status(201).json({ success: true, question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const questions = await QuestionRepository.findAll();
      res.json(questions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getQuestionsByTopic: async (req, res) => {
    try {
      const { topicId } = req.params;
      const questions = await QuestionRepository.findByTopicId(topicId);
      res.status(200).json({ success: true, questions });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getQuestionById: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await QuestionRepository.findById(id);
      res.status(200).json({ success: true, question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await QuestionRepository.deleteById(id);
      res.status(200).json({ success: true, question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

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

  // getQuestionsGrid: async (req, res) => {
  //   try {
  //     const { startRow, endRow, sortModel, searchText, filters } = req.body;

  //     const rows = await QuestionRepository.getPaginated({
  //       startRow: startRow || 0,
  //       endRow: endRow || 50,
  //       sortModel: sortModel || [],
  //       searchText: searchText || "",
  //       filters: filters || {}, // ✅ pass filters
  //     });

  //     const totalCount = await QuestionRepository.getCount({
  //       searchText: searchText || "",
  //       filters: filters || {}, // ✅ pass filters
  //     });

  //     res.status(200).json({
  //       success: true,
  //       rows,
  //       lastRow: totalCount,
  //     });
  //   } catch (err) {
  //     console.error("Error in getQuestionsGrid:", err);
  //     res.status(500).json({ success: false, error: err.message });
  //   }
  // },

  getQuestionsGrid: async (req, res) => {
    try {
      const { startRow, endRow, sortModel, searchText, filters } = req.body;

      // ✅ Calculate filterCount
      let filterCount = 0;
      if (filters && typeof filters === "object") {
        filterCount = Object.values(filters).reduce((count, arr) => {
          if (Array.isArray(arr) && arr.length > 0) {
            return count + arr.length;
          }
          return count;
        }, 0);
      }

      const rows = await QuestionRepository.getPaginated({
        startRow: startRow || 0,
        endRow: endRow || 50,
        sortModel: sortModel || [],
        searchText: searchText || "",
        filters: filters || {},
      });

      const totalCount = await QuestionRepository.getCount({
        searchText: searchText || "",
        filters: filters || {},
      });

      res.status(200).json({
        success: true,
        rows,
        lastRow: totalCount,
        ...(filterCount > 0 && { filterCount }), // ✅ include only when > 0
      });
    } catch (err) {
      console.error("Error in getQuestionsGrid:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

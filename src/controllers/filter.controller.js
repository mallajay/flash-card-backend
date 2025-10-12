import { FilterRepository } from "../repositories/filter.repository.js";

export const FilterController = {
  create: async (req, res) => {
    try {
      const filter = await FilterRepository.create(req.body);
      res.status(201).json({ success: true, filter });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const filters = await FilterRepository.findAll();
      res.json({ success: true, filters });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const filter = await FilterRepository.findById(id);
      if (!filter) {
        return res
          .status(404)
          .json({ success: false, message: "Filter not found" });
      }
      res.json({ success: true, filter });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const filter = await FilterRepository.update(id, req.body);
      if (!filter) {
        return res
          .status(404)
          .json({ success: false, message: "Filter not found" });
      }
      res.json({ success: true, filter });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const filter = await FilterRepository.delete(id);
      if (!filter) {
        return res
          .status(404)
          .json({ success: false, message: "Filter not found" });
      }
      res.json({ success: true, message: "Filter deleted", filter });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

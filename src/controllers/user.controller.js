import { UserRepository } from "../repositories/user.repository.js";

export const UserController = {
  create: async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = await UserRepository.create(name, email);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const users = await UserRepository.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserRepository.findById(id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      const user = await UserRepository.update(id, name, email);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await UserRepository.delete(id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json({ message: "User deleted", user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

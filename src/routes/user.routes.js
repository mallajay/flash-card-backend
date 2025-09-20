import express from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", UserController.create); // Create
router.get("/", UserController.getAll); // Read All
router.get("/:id", UserController.getOne); // Read One
router.put("/:id", UserController.update); // Update
router.delete("/:id", authMiddleware, UserController.delete); // Delete

export default router;

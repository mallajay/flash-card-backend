import express from "express";
import { SubjectController } from "../controllers/subject.controller.js";

const router = express.Router();

router.post("/", SubjectController.create); // Create
router.get("/", SubjectController.getAll); // Read All
router.get("/:id", SubjectController.getOne); // Read One
router.put("/:id", SubjectController.update); // Update
router.delete("/:id", SubjectController.delete); // Delete

export default router;

import express from "express";
import { ChapterTopicController } from "../controllers/chapterTopic.controller.js";
import { validateUUID } from "../middleware/validateUUID.js";

const router = express.Router();

// CRUD routes
router.post("/", ChapterTopicController.create);
router.post("/bulk", ChapterTopicController.bulkCreate);
router.get("/", ChapterTopicController.getAll);

router.get(
  "/grouped/by-chapter/:chapter_id",
  validateUUID("chapter_id"),
  ChapterTopicController.getGroupedByChapter
);

// Custom queries (static first)
router.get("/list", ChapterTopicController.getAllWithDetails);
router.get(
  "/chapter/:chapter_id",
  validateUUID("chapter_id"),
  ChapterTopicController.getByChapterId
);
router.get(
  "/subject/:subject_id",
  validateUUID("subject_id"),
  ChapterTopicController.getBySubjectId
);

// Dynamic must come last
router.get("/:id", validateUUID("id"), ChapterTopicController.getById);
router.put("/:id", validateUUID("id"), ChapterTopicController.update);
router.delete("/:id", validateUUID("id"), ChapterTopicController.delete);

export default router;

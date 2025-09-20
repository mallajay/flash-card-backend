import { Router } from "express";
import { ChapterController } from "../controllers/chapter.controller.js";

const router = Router();

router.post("/", ChapterController.create);
router.get("/", ChapterController.getAll);
router.get("/:id", ChapterController.getOne);
router.put("/:id", ChapterController.update);
router.delete("/:id", ChapterController.delete);
router.get("/subject/:subjectId", ChapterController.findBySubjectId);

export default router;

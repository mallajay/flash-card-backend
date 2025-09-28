import express from "express";
import { QuestionController } from "../controllers/question.controller.js";

const router = express.Router();

router.post("/", QuestionController.createQuestion);
router.get("/", QuestionController.getAll);
router.post("/grid", QuestionController.getQuestionsGrid);
router.get("/topic/:topicId", QuestionController.getQuestionsByTopic);
router.get("/:id", QuestionController.getQuestionById);
router.delete("/:id", QuestionController.deleteQuestion);

export default router;

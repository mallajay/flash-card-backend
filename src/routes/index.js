import express from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import subjectsRouts from "./subject.routes.js";
import chapterRoutes from "./chapter.routes.js";
import chapterTopicRoutes from "./chapterTopic.routes.js";
import questionRoutes from "./question.routes.js";
import filterRoutes from "./filter.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/subjects", subjectsRouts);
router.use("/chapters", chapterRoutes);
router.use("/chapter-topic", chapterTopicRoutes);
router.use("/questions", questionRoutes);
router.use("/filter", filterRoutes);

export default router;

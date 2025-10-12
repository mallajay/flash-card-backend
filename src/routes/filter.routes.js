import express from "express";
import { FilterController } from "../controllers/filter.controller.js";

const router = express.Router();

router.post("/", FilterController.create);
router.get("/", FilterController.getAll);
router.get("/:id", FilterController.getById);
router.put("/:id", FilterController.update);
router.delete("/:id", FilterController.delete);

export default router;

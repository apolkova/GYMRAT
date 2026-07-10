import { Router } from "express";
import {
  createExercise,
  deleteExercise,
  getExerciseById,
  getExercises,
  updateExercise,
} from "../controllers/exerciseController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getExercises);
router.post("/", createExercise);
router.get("/:id", getExerciseById);
router.put("/:id", updateExercise);
router.delete("/:id", deleteExercise);

export default router;
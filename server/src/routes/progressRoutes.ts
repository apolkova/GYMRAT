import { Router } from "express";
import { getExerciseProgress } from "../controllers/progressController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/exercises/:exerciseId", getExerciseProgress);

export default router;
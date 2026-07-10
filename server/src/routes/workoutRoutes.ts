import { Router } from "express";
import {
  createWorkout,
  deleteWorkout,
  getWorkoutById,
  getWorkouts,
  updateWorkout,
} from "../controllers/workoutController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", getWorkouts);
router.post("/", createWorkout);
router.get("/:id", getWorkoutById);
router.delete("/:id", deleteWorkout);
router.put("/:id", updateWorkout);

export default router;
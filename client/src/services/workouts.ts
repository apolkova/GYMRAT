import api from "./api";
import type {
  CreateWorkoutInput,
  CreateWorkoutResponse,
  WorkoutsResponse,
} from "../types/workout";

export async function getWorkouts() {
  const response = await api.get<WorkoutsResponse>("/workouts");
  return response.data.workouts;
}

export async function createWorkout(input: CreateWorkoutInput) {
  const response = await api.post<CreateWorkoutResponse>("/workouts", input);
  return response.data.workout;
}
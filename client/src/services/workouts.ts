import api from "./api";
import type {
  CreateWorkoutInput,
  CreateWorkoutResponse,
  Workout,
  WorkoutsResponse,
} from "../types/workout";

export type WorkoutResponse = {
  workout: Workout;
};

export async function getWorkouts() {
  const response = await api.get<WorkoutsResponse>("/workouts");
  return response.data.workouts;
}

export async function getWorkoutById(id: string) {
  const response = await api.get<WorkoutResponse>(`/workouts/${id}`);
  return response.data.workout;
}

export async function createWorkout(input: CreateWorkoutInput) {
  const response = await api.post<CreateWorkoutResponse>("/workouts", input);
  return response.data.workout;
}

export async function deleteWorkout(id: string) {
  await api.delete(`/workouts/${id}`);
}

export async function updateWorkout(id: string, input: CreateWorkoutInput) {
  const response = await api.put<CreateWorkoutResponse>(
    `/workouts/${id}`,
    input
  );

  return response.data.workout;
}
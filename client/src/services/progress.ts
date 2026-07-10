import api from "./api";
import type { ExerciseProgressResponse } from "../types/progress";

export async function getExerciseProgress(exerciseId: string) {
  const response = await api.get<ExerciseProgressResponse>(
    `/progress/exercises/${exerciseId}`
  );

  return response.data;
}
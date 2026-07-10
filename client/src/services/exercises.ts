import api from "./api";
import type {
  CreateExerciseResponse,
  ExercisesResponse,
} from "../types/exercise";

export type CreateExerciseInput = {
  name: string;
  muscleGroup: string;
  equipment?: string;
  instructions?: string;
};

export async function getExercises() {
  const response = await api.get<ExercisesResponse>("/exercises");
  return response.data.exercises;
}

export async function createExercise(input: CreateExerciseInput) {
  const response = await api.post<CreateExerciseResponse>("/exercises", input);
  return response.data.exercise;
}
export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  instructions: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ExercisesResponse = {
  exercises: Exercise[];
};

export type CreateExerciseResponse = {
  message: string;
  exercise: Exercise;
};
export type ProgressExercise = {
  id: string;
  name: string;
  muscleGroup: string;
};

export type ProgressEntry = {
  date: string;
  workoutTitle: string;
  setNumber: number;
  reps: number;
  weight: number;
  unit: string;
  volume: number;
};

export type ExerciseProgressResponse = {
  exercise: ProgressExercise;
  entries: ProgressEntry[];
  summary: {
    maxWeight: number;
    totalVolume: number;
    totalSets: number;
  };
};
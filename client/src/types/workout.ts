import type { Exercise } from "./exercise";

export type WorkoutSet = {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise: Exercise;
  setNumber: number;
  reps: number;
  weight: number;
  unit: string;
  createdAt: string;
};

export type Workout = {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  date: string;
  sets: WorkoutSet[];
  createdAt: string;
  updatedAt: string;
};

export type WorkoutsResponse = {
  workouts: Workout[];
};

export type CreateWorkoutResponse = {
  message: string;
  workout: Workout;
};

export type CreateWorkoutSetInput = {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  unit: string;
};

export type CreateWorkoutInput = {
  title: string;
  notes?: string;
  sets: CreateWorkoutSetInput[];
};
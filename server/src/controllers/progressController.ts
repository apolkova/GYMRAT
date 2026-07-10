import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export async function getExerciseProgress(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const exerciseId = req.params.exerciseId;

    if (!exerciseId || Array.isArray(exerciseId)) {
      res.status(400).json({ message: "Exercise id is required" });
      return;
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      select: {
        id: true,
        name: true,
        muscleGroup: true,
      },
    });

    if (!exercise) {
      res.status(404).json({ message: "Exercise not found" });
      return;
    }

    const sets = await prisma.workoutSet.findMany({
      where: {
        exerciseId,
        workout: {
          userId: req.user.id,
        },
      },
      include: {
        workout: {
          select: {
            title: true,
            date: true,
          },
        },
      },
      orderBy: {
        workout: {
          date: "asc",
        },
      },
    });

    const entries = sets.map((set) => ({
      date: set.workout.date,
      workoutTitle: set.workout.title,
      setNumber: set.setNumber,
      reps: set.reps,
      weight: set.weight,
      unit: set.unit,
      volume: set.reps * set.weight,
    }));

    const maxWeight = entries.length
      ? Math.max(...entries.map((entry) => entry.weight))
      : 0;

    const totalVolume = entries.reduce((sum, entry) => {
      return sum + entry.volume;
    }, 0);

    res.json({
      exercise,
      entries,
      summary: {
        maxWeight,
        totalVolume,
        totalSets: entries.length,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while loading exercise progress",
    });
  }
}
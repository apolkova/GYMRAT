import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export async function getDashboardSummary(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const workouts = await prisma.workout.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        sets: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const totalWorkouts = workouts.length;

    const totalSets = workouts.reduce((sum, workout) => {
      return sum + workout.sets.length;
    }, 0);

    const totalVolumeKg = workouts.reduce((sum, workout) => {
      const workoutVolume = workout.sets.reduce((setSum, set) => {
        return setSum + set.reps * set.weight;
      }, 0);

      return sum + workoutVolume;
    }, 0);

    const latestWorkout = workouts[0]
      ? {
          id: workouts[0].id,
          title: workouts[0].title,
          date: workouts[0].date,
        }
      : null;

    res.json({
      totalWorkouts,
      totalSets,
      totalVolumeKg,
      latestWorkout,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while loading dashboard summary",
    });
  }
}
import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

type WorkoutSetInput = {
  exerciseId?: string;
  setNumber?: number;
  reps?: number;
  weight?: number;
  unit?: string;
};

export async function getWorkouts(req: Request, res: Response): Promise<void> {
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
        sets: {
          include: {
            exercise: true,
          },
          orderBy: {
            setNumber: "asc",
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    res.json({ workouts });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while fetching workouts",
    });
  }
}

export async function getWorkoutById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      res.status(400).json({ message: "Workout id is required" });
      return;
    }

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
      include: {
        sets: {
          include: {
            exercise: true,
          },
          orderBy: {
            setNumber: "asc",
          },
        },
      },
    });

    if (!workout) {
      res.status(404).json({ message: "Workout not found" });
      return;
    }

    res.json({ workout });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while fetching the workout",
    });
  }
}

export async function createWorkout(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const body = req.body as {
      title?: string;
      notes?: string;
      sets?: WorkoutSetInput[];
    };

    const { title, notes } = body;
    const workoutSets = body.sets;

    if (!title) {
      res.status(400).json({ message: "Workout title is required" });
      return;
    }

    if (!Array.isArray(workoutSets) || workoutSets.length === 0) {
      res.status(400).json({
        message: "At least one workout set is required",
      });
      return;
    }

    for (const set of workoutSets) {
      if (
        !set.exerciseId ||
        typeof set.setNumber !== "number" ||
        typeof set.reps !== "number" ||
        typeof set.weight !== "number"
      ) {
        res.status(400).json({
          message:
            "Each set must include exerciseId, setNumber, reps, and weight",
        });
        return;
      }
    }

    const workout = await prisma.workout.create({
        data: {
            title,
            notes: notes ?? null,
            userId: req.user.id,
            sets: {
            create: workoutSets.map((set) => ({
                exerciseId: set.exerciseId as string,
                setNumber: set.setNumber as number,
                reps: set.reps as number,
                weight: set.weight as number,
                unit: set.unit ?? "lb",
            })),
            },
        },
        include: {
            sets: {
            include: {
                exercise: true,
            },
            orderBy: {
                setNumber: "asc",
            },
            },
        },
    });

    res.status(201).json({
      message: "Workout created successfully",
      workout,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while creating the workout",
    });
  }
}

export async function deleteWorkout(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      res.status(400).json({ message: "Workout id is required" });
      return;
    }

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!workout) {
      res.status(404).json({ message: "Workout not found" });
      return;
    }

    await prisma.workout.delete({
      where: { id },
    });

    res.json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while deleting the workout",
    });
  }
}
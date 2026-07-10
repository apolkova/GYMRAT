import type { Request, Response } from "express";
import prisma from "../lib/prisma.js";

export async function getExercises(_req: Request, res: Response): Promise<void> {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      exercises,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while fetching exercises",
    });
  }
}

export async function getExerciseById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = String(req.params.id);

    if (!id) {
      res.status(400).json({
        message: "Exercise id is required",
      });
      return;
    }

    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      res.status(404).json({
        message: "Exercise not found",
      });
      return;
    }

    res.json({
      exercise,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while fetching the exercise",
    });
  }
}

export async function createExercise(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, muscleGroup, equipment, instructions } = req.body;

    if (!name || !muscleGroup) {
      res.status(400).json({
        message: "Name and muscle group are required",
      });
      return;
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        equipment,
        instructions,
      },
    });

    res.status(201).json({
      message: "Exercise created successfully",
      exercise,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while creating the exercise",
    });
  }
}

export async function updateExercise(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = String(req.params.id);

    if (!id) {
      res.status(400).json({
        message: "Exercise id is required",
      });
      return;
    }

    const { name, muscleGroup, equipment, instructions } = req.body;

    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      res.status(404).json({
        message: "Exercise not found",
      });
      return;
    }

    const exercise = await prisma.exercise.update({
      where: { id },
      data: {
        name,
        muscleGroup,
        equipment,
        instructions,
      },
    });

    res.json({
      message: "Exercise updated successfully",
      exercise,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while updating the exercise",
    });
  }
}

export async function deleteExercise(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = String(req.params.id);

    if (!id) {
      res.status(400).json({
        message: "Exercise id is required",
      });
      return;
    }

    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      res.status(404).json({
        message: "Exercise not found",
      });
      return;
    }

    await prisma.exercise.delete({
      where: { id },
    });

    res.json({
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while deleting the exercise",
    });
  }
}
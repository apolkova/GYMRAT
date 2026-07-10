import express from "express";
import cors from "cors";

import prisma from "./lib/prisma.js"; //testing
import authRoutes from "./routes/authRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "GymRat API is running",
  });
});

app.get("/api/db-test", async (_req, res) => {
  try {
    const userCount = await prisma.user.count();

    res.json({
      status: "ok",
      message: "Database connection is working",
      userCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

export default app;
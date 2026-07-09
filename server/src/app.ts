import express from "express";
import cors from "cors";

import prisma from "./lib/prisma.js"; //testing

const app = express();

app.use(cors());
app.use(express.json());

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
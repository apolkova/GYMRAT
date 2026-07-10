import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

type TokenPayload = {
  userId: string;
};

function isTokenPayload(payload: string | jwt.JwtPayload): payload is TokenPayload {
  return typeof payload !== "string" && typeof payload.userId === "string";
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authorization token is required",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Authorization token is required",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret);

    if (!isTokenPayload(decoded)) {
      res.status(401).json({
        message: "Invalid token payload",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(401).json({
        message: "User no longer exists",
      });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}
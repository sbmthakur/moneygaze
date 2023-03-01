import express from "express";
import { Request, Response, Router, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const cors = require("cors");
import { userRouter } from "./user";
import { linkRouter } from "./link";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
//import { AppDataSource } from './data-source';
//import { User } from './entity/User';

const nextUrl = process.env.NEXT_BASE_PATH;

export interface RequestWithPrisma extends Request {
  prisma: PrismaClient;
}

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

const corsOptions = {
  methods: ["GET", "PUT", "POST"],
  origin: nextUrl,
  allowedHeaders: ["Content-Type", "API_KEY"],
  optionsSuccessStatus: 200,
};

app.use((req: Request, response: Response, next: NextFunction) => {
  (req as RequestWithPrisma).prisma = prisma;
  next();
});

app.use(cors(corsOptions));
//app.use(bodyParser)
app.use("/api", userRouter);
app.use("/api", linkRouter);

app.listen(port, async () => {
  console.log(`Server started on ${port}`);
  await prisma.$queryRaw`PRAGMA journal_mode = wal`;
});

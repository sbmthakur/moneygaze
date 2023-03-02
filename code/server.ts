import express from "express";
import { Request, Response, Router, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const cors = require("cors");
import { userRouter } from "./user";
import { linkRouter } from "./link";
import { PrismaClient } from "@prisma/client";
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express")
const prisma = new PrismaClient();

const swaggerOptions = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MoneyGaze API',
      version: '1.0.0',
      description: 'REST API doc for MoneyGaze'
    }
  },
  apis: ['./code/openapi/*.yaml']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(cors(corsOptions));

//app.use(bodyParser)
app.use("/api", userRouter);
app.use("/api", linkRouter);

app.listen(port, async () => {
  console.log(`Server started on ${port}`);
  await prisma.$queryRaw`PRAGMA journal_mode = wal`;
});

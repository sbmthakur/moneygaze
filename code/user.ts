import { Request, Response, Router } from "express";
import bodyParser from 'body-parser';
import { RequestWithPrisma } from "./server";

const jsonParser = bodyParser.json();

const router = Router();

router.post('/login', jsonParser, (request: Request, response: Response) => {
    response.send({ "done": true })
})

router.post('/register', jsonParser, (request: Request, response: Response) => {
    response.send({ "done": true })
})

export const userRouter = router;
import { Request, Response, Router } from "express";
import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const router = Router();

router.get('/info', (request: Request, response: Response) => {
    response.send({ "done": true })
})

router.post('/login', jsonParser, (request: Request, response: Response) => {
    response.send({ "done": true })
})

router.post('/register', jsonParser, (request: Request, response: Response) => {
    response.send({ "done": true })
})

export const userRouter = router;
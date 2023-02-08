import { Request, Response, Router } from "express";
import bodyParser from 'body-parser';
import { RequestWithPrisma } from "./server";

const jsonParser = bodyParser.json();

const router = Router();

router.get('/info', async (request: Request, response: Response) => {
    const prisma = (request as RequestWithPrisma).prisma

    const usersWithPosts = await prisma.user.findMany({
        include: {
            posts: true,
        },
    })
    response.send(usersWithPosts)
    //response.send({ "done": true })
})

router.post('/login', jsonParser, (request: Request, response: Response) => {
    response.send({ "done": true })
})

router.post('/register', jsonParser, (request: Request, response: Response) => {
    response.send({ "done": true })
})

export const userRouter = router;
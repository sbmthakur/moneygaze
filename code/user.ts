import { Request, Response, Router } from "express";
import bodyParser from 'body-parser';
import { RequestWithPrisma } from "./server";
import bcrypt from 'bcrypt';
import { Prisma } from "@prisma/client";

const jsonParser = bodyParser.json();

const router = Router();

/*
interface User {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
}
*/

router.get('/info', async (request: Request, response: Response) => {
    // const prisma = (request as RequestWithPrisma).prisma

    // const usersWithPosts = await prisma.user.findMany({Prisma.UserDelegate 
    //     include: {
    //         posts: true,
    //     },
    // })
    // response.send(usersWithPosts)
    response.send({ "done": true })
})

router.post('/login', jsonParser, async (request: Request, response: Response) => {
     const prisma = (request as RequestWithPrisma).prisma

        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).send('Missing required fields');
        }

        const user = await prisma.user.findUnique({ where: { email },
                                            select: { email: true, password: true }, 
                                            });


        if (!user) {
            return response.status(401).send('Invalid email or password');
        }

        const passwordMatch = await bcrypt.compare(password, user.password as string);

        if (!passwordMatch) {
            return response.status(401).send('Invalid email or password');
        }
  
        response.send({ "success": true })
})

router.post('/register', jsonParser, async (request: Request, response: Response) => {

   const prisma = (request as RequestWithPrisma).prisma

    const { firstName,lastName, email, password } = request.body;

        if (!firstName || !email || !password) {
            return response.status(400).send('Missing required fields');
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            first_name: firstName as string,
            last_name : lastName as string,
            email: email as string,
            password: hashedPassword as string,
        }
        try {
        await prisma.user.create({ data: newUser });
        response.status(201).send({ "success": true });
    } catch (error) {
        console.error(error);
        response.status(500).send({ "success": false });
    }

})

export const userRouter = router;
import {
    Request,
    Response,
    Router
} from "express";
import bodyParser from 'body-parser';
import {
    RequestWithPrisma
} from "./server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWTsecret = process.env.JWTSEC as string;

const jsonParser = bodyParser.json();

const router = Router();

interface UserData {
    user_id: number,
    email: string,
    password: string
}


router.get('/info', async (request: Request, response: Response) => {

    response.send({
        "done": true
    })
})

router.post('/login', jsonParser, async (request: Request, response: Response) => {

    const {
        email,
        password
    } = request.body;

    if (!email || !password) {
        return response.status(400).send('Missing required fields');
    }

    const userData = await fetchUserData(email, request);

    if (!userData) {
        return response.status(401).send('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, userData.password as string);

    if (!passwordMatch) {
        return response.status(401).send('Invalid email or password');
    }

    const result = await formJwt(userData as UserData);

    response.status(200).send(result);
})

router.post('/register', jsonParser, async (request: Request, response: Response) => {

    const prisma = (request as RequestWithPrisma).prisma

    const {
        firstName,
        lastName,
        email,
        password
    } = request.body;

    console.log(firstName, lastName, email, password)

    if (!firstName || !email || !password) {
        return response.status(400).send('Missing required fields');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        first_name: firstName as string,
        last_name: lastName as string,
        email: email as string,
        password: hashedPassword as string,
    };
    try {
        await prisma.user.create({
            data: newUser
        });

        const userData = await fetchUserData(email, request);

        const result = await formJwt(userData as UserData);

        response.status(200).send(result);
    } catch (error) {
        console.error(error);
        response.status(500).send({
            "success": false
        });
    }
})

const formJwt = async (userData: UserData) => {
    const token = jwt.sign({
            _id: userData.user_id,
            email: userData.email
        }, JWTsecret, {
            expiresIn: '20 days',
        });
        const res = {
            uniqueid: userData.user_id,
            ssotoken: token
        }
        return res;
}

const fetchUserData = async (userEmail: string, request: Request): Promise<UserData | null>  => {
    const prisma = (request as RequestWithPrisma).prisma
    const userData = await prisma.user.findUnique({
        where: {
            email: userEmail
        },
        select: {
            user_id: true,
            email: true,
            password: true
        },
    });
        
        return userData;
}

export const userRouter = router;
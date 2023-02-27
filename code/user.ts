import { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import { RequestWithPrisma } from "./server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
const JWTsecret = process.env.JWTSEC as string;

const jsonParser = bodyParser.json();

const router = Router();

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
interface UserData {
  user_id: number;
  email: string;
  password: string;
}

router.get("/info", async (request: Request, response: Response) => {
  response.send({
    done: true,
  });
});

router.post(
  "/login",
  jsonParser,
  async (request: Request, response: Response) => {
    try {
      console.log("Ikde");
      const { email, password } = request.body;

      console.log(email, password);

      if (!email || !password) {
        return response.status(400).send({
          message: "Missing required fields",
        });
      }

      const userData = await fetchUserData(email, request);

      if (!userData) {
        return response.status(404).send({
          message: "User doesn't exist, create new account.",
        });
      }

      const passwordMatch = await bcrypt.compare(
        password,
        userData.password as string
      );

      if (!passwordMatch) {
        return response.status(401).send({
          message: "Invalid email or password",
        });
      }

      const result = await formJwt(userData as UserData);

      response.status(200).send(result);
    } catch (error) {
      console.error(error);
      response.status(500).send({
        message: "Something went worong. Try again.",
      });
    }
  }
);

router.post(
  "/register",
  jsonParser,
  async (request: Request, response: Response) => {
    try {
      const prisma = (request as RequestWithPrisma).prisma;

      const { firstName, lastName, email, password } = request.body;

      console.log(firstName, lastName, email, password);

      if (!firstName || !email || !password) {
        return response.status(400).send({
          message: "Missing required fields",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        first_name: firstName as string,
        last_name: lastName as string,
        email: email as string,
        password: hashedPassword as string,
      };

      await prisma.user.create({
        data: newUser,
      });

      const userData = await fetchUserData(email, request);

      const result = await formJwt(userData as UserData);

      response.status(200).send(result);
    } catch (error) {
      console.error(error);
      response.status(500).send({
        message: "Something went wrong. Try again.",
      });
    }
  }
);

router.post(
  "/registerviagoogle",
  jsonParser,
  async (request: Request, response: Response) => {
    try {
      const prisma = (request as RequestWithPrisma).prisma;

      const token = request.body.credential;
      // console.log("Body");
      // console.log(request.body);
      // console.log("credential in verifying backend");
      // console.log(token);

      const payload = await verify(token).catch(console.error);
      if (payload) {
        const newUser = {
          first_name: payload.given_name as string,
          last_name: payload.family_name as string,
          email: payload.email as string,
          password: "dummy",
        };

        const userData = await prisma.user.findUnique({
          where: {
            email: newUser.email,
          },
        });

        if (userData) {
          response.status(409).send("Duplicate User");
        } else {
          await prisma.user.create({
            data: newUser,
          });

          const userData = await fetchUserData(newUser.email, request);

          const result = await formJwt(userData as UserData);

          response.status(200).send(result);
        }
      } else {
        response
          .status(500)
          .send({ message: "Something went wrong. Try again." });
      }
    } catch (error) {
      console.error(error);
      response.status(500).send({
        message: "Something went wrong. Try again.",
      });
    }
  }
);

router.post(
  "/loginviagoogle",
  jsonParser,
  async (request: Request, response: Response) => {
    try {
      const prisma = (request as RequestWithPrisma).prisma;

      const token = request.body.credential;

      const payload = await verify(token).catch(console.error);
      if (payload) {
        const userData = await fetchUserData(payload.email as string, request);

        if (!userData) {
          return response.status(404).send({
            message: "User doesn't exist, create new account.",
          });
        }

        const result = await formJwt(userData as UserData);

        response.status(200).send(result);
      } else {
        response
          .status(500)
          .send({ message: "Something went wrong. Try again." });
      }
    } catch (error) {
      console.error(error);
      response.status(500).send({
        message: "Something went wrong. Try again.",
      });
    }
  }
);

async function verify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  if (payload != null) {
    const userid = payload["sub"];
  }
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  return payload;
}

const formJwt = async (userData: UserData) => {
  const token = jwt.sign(
    {
      _id: userData.user_id,
      email: userData.email,
    },
    JWTsecret,
    {
      expiresIn: "20 days",
    }
  );
  const res = {
    uniqueid: userData.user_id,
    ssotoken: token,
  };
  return res;
};

const fetchUserData = async (
  userEmail: string,
  request: Request
): Promise<UserData | null> => {
  const prisma = (request as RequestWithPrisma).prisma;
  const userData = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      user_id: true,
      email: true,
      password: true,
    },
  });

  return userData;
};

export const userRouter = router;

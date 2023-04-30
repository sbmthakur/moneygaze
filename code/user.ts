import { Request, Response, Router } from "express";
import bodyParser from "body-parser";
import { RequestWithPrisma } from "./server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Prisma } from "@prisma/client";
import { readFileSync, writeFileSync, existsSync } from "fs";

import cheerio from "cheerio";
import axios from "axios";

const JWTsecret = process.env.JWTSEC as string;

const jsonParser = bodyParser.json();

const router = Router();

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
export type UserData = Prisma.PromiseReturnType<typeof fetchUserData>;

interface card {
  image?: String;
  name?: String;
  annual_fee?: String;
  recommended?: String;
  reward_rate?: String;
}

async function scrapeCreditCardsPointsGuy() {
  const url = "https://thepointsguy.com/credit-cards/best/";
  const response = await axios.get(url);

  const $ = cheerio.load(response.data);

  const cards: Object[] = [];

  $(".phx-c\\:credit-card-horizontal").each((i: Object, element) => {
    const c: card = {};
    c.image = $(element).find("._card_img").attr("src");
    var temp_name = $(element)
      .find(".phx-c\\:content-header")
      .find("h2.phx-subheading")
      .text();
    temp_name = temp_name.substring(7);
    c.name = temp_name.substring(0, temp_name.length - 3);
    /*
    var temp_annual_fee = $(element)
      .find(".phx-c\\:card-annual-fee")
      //.find(".phx-number")
      .find("phx-label --lg")
      .text();
      */

    let temp_annual_fee = $(element)
    .find(".phx-c\\:card-annual-fee")
    .find("div")
    .text();

    console.log(temp_annual_fee)
    temp_annual_fee = temp_annual_fee.substring(5).substring(0,3);
    //c.annual_fee = temp_annual_fee.substring(0, temp_annual_fee.length - 3);
    c.annual_fee = temp_annual_fee.trim()
    if (c.annual_fee.endsWith('\n')) {
      console.log('lol')
    }
    // c.annual_fee = temp_annual_fee;
    /*
    var temp_recommended = $(element)
      .find(".phx-c\\:card-recommended-credit")
      .find(".phx-number")
      .text();
    temp_recommended = temp_recommended.substring(3);
    c.recommended = temp_recommended.substring(0, temp_recommended.length - 12);
    */
    c.recommended = $(element).find(".phx-c\\:card-recommended-credit").find("div.phx-label").text().trim().substring(0,7)

    /*
    var temp_reward_rate = $(element)
      .find("._rewards")
      .find(".phx-c\\:card-reward-rates")
      .find(".phx-number.--md.--lowercase")
      .text();
    temp_reward_rate = temp_reward_rate.substring(3);
    c.reward_rate = temp_reward_rate.substring(0, temp_reward_rate.length - 1);
    */

    c.reward_rate = $(element).find(".phx-c\\:card-reward-rates").find("span.phx-body-copy").text().trim().split('\n')[0]

    cards.push(c);
  });
  return cards;
}

router.get("/info", async (request: Request, response: Response) => {
  // @ts-ignore
  const { qtype } = request.query
  let data;

  if (existsSync('./cards.json')) {
    data = await readFileSync('./cards.json', { encoding: 'utf-8'} );
    data = JSON.parse(data)
  } else {
    data = await scrapeCreditCardsPointsGuy();
    await writeFileSync('./cards.json', JSON.stringify(data, null, 2));
  }

  if (qtype) {
  // @ts-ignore
    data = data.filter(c => c.reward_rate.toLowerCase().includes(qtype.toLowerCase()))
  }
  response.send(data)
});

router.post(
  "/login",
  jsonParser,
  async (request: Request, response: Response) => {
    try {
      const email = request.body.email;
      const pass = request.body.password;

      console.log(email, pass);

      if (!email || !pass) {
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
        pass,
        userData.password as string
      );

      if (!passwordMatch) {
        return response.status(401).send({
          message: "Invalid email or password",
        });
      }

      let result = await formJwt(userData as UserData);

      const { password, ...returnUserData } = userData;

      result = {
        ...result,
        ...returnUserData,
      };

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

      const { firstName, lastName } = request.body;

      const email = request.body.email;
      const pass = request.body.password;

      console.log(firstName, lastName, email, pass);

      if (!firstName || !email || !pass) {
        return response.status(400).send({
          message: "Missing required fields",
        });
      }
      const hashedPassword = await bcrypt.hash(pass, 10);

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

      if (userData) {
        const { password, ...returnUserData } = userData;
        let result = await formJwt(userData as UserData);

        result = {
          ...result,
          ...returnUserData,
        };

        response.status(200).send(result);
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
  "/registerviagoogle",
  jsonParser,
  async (request: Request, response: Response) => {
    try {
      const prisma = (request as RequestWithPrisma).prisma;

      const token = request.body.credential;

      const payload = await verify(token).catch(console.error);
      if (payload) {
        const newUser = {
          first_name: payload.given_name as string,
          last_name: payload.family_name as string,
          email: payload.email as string,
          user_image: payload.picture as string,
          password: "dummy",
        };

        const userExists = await prisma.user.findUnique({
          where: {
            email: newUser.email,
          },
        });

        if (!userExists) {
          await prisma.user.create({
            data: newUser,
          });
        }
        const userData = await fetchUserData(newUser.email, request);
        if (userData) {
          let result = await formJwt(userData as UserData);
          const { password, ...returnUserData } = userData;
          result = {
            ...result,
            ...returnUserData,
          };
          response.status(200).send(result);
        }
      } else {
        response.status(500).send({
          message: "Something went wrong. Try again.",
        });
      }
    } catch (error) {
      console.error(error);
      response.status(500).send({
        message: "Something went wrong. Try again.",
      });
    }
  }
);

export async function verify(token: string) {
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
      _id: userData!.user_id,
      email: userData!.email,
    },
    JWTsecret,
    {
      expiresIn: "20 days",
    }
  );
  const res = {
    uniqueid: userData!.user_id,
    ssotoken: token,
  };
  return res;
};

export const fetchUserData = async (userEmail: string, request: Request) => {
  const prisma = (request as RequestWithPrisma).prisma;
  const userData = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      email: true,
      password: true,
      user_image: true,
    },
  });

  return userData;
};

export const userRouter = router;

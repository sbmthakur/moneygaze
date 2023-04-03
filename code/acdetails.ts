import {
    Request,
    Response,
    Router
} from "express";
const router = Router();

import {
  verify
} from "jsonwebtoken";

const JWTsecret = process.env.JWTSEC as string;

export interface TokenInterface {
  _id: number;
  email: string;
}

router.get("/info", async (request: Request, response: Response) => {
    response.send({
        done: true,
    });
});

import {
    fetchUserAccountAndTransactions
} from "./link";

router.get("/getaccountdetails", async (request: Request, response: Response) => {
    try {

        const uniqueidHeader = request.headers.uniqueid as string;
        let uniqueid: number = parseInt(uniqueidHeader);

        const payload = verify(request.headers.ssotoken as string, JWTsecret);
        // console.log(payload, (payload as TokenInterface)._id, uniqueid)

        if ((payload as TokenInterface)._id != uniqueid) {
            return response.status(401).send({"message": "Invalid ssotoken."})
        }

        const resData = await fetchUserAccountAndTransactions(uniqueid, request);
        return response.send(resData);

    } catch (error) {
        console.error(error);
        response.status(500).send({
            message: "Something went worong. Try again.",
        });
    }
});

export const acDetailsRouter = router;
import {
    Request,
    Response,
    Router
} from "express";
const router = Router();

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

        const resData = await fetchUserAccountAndTransactions(uniqueid, request);
        if (!resData.accounts){
            return response.status(204).send(resData)
        }
        return response.send(resData);

    } catch (error) {
        console.error(error);
        response.status(500).send({
            message: "Something went worong. Try again.",
        });
    }
});

export const acDetailsRouter = router;
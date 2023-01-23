import { Request, Response, Router } from "express";
import { CountryCode, Configuration, PlaidApi, PlaidEnvironments, Products } from "plaid";

const router = Router();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(
  ',',
);

const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
  ',',
);

console.log(process.env.PLAID_SECRET)
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET
    },
  },
})

const client = new PlaidApi(configuration);

router.post('/create_link_token', async (req: Request, res: Response) => {

  const configs = {
    user: {
      client_user_id: 'my-id'
    },
    client_name: 'MoneyGaze',
    products: PLAID_PRODUCTS as Products[],
    country_codes: PLAID_COUNTRY_CODES as CountryCode[],
    language: 'en'
  }

  const createTokenResponse = await client.linkTokenCreate(configs)
  res.send(createTokenResponse.data)
})

export const linkRouter = router
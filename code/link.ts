import { Request, Response, Router } from "express";
import { CountryCode, Configuration, PlaidApi, PlaidEnvironments, Products } from "plaid";
import { AccountBase, AccountType } from "plaid";
const router = Router();

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',');
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(',');

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET
    },
  },
})

interface ResponseAccount {
  acc_num: string
  acc_name: string
  ins_name: string
  ins_logo: string
  balance: number
}

type AccountsCollection = { [key in AccountType]? : ResponseAccount[] }

interface ResponseTransaction {
  amount: number
  name: string
  date: string
  payment_metadata: Record<string, number | string>
}

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

router.post('/exchange_public_token', async (req: Request, res: Response) => {
  
  const response = await client.itemPublicTokenExchange({
    public_token: req.body.public_token
  })

  const access_token = response.data.access_token;
  

  let ed = new Date()
  const tz_offset = ed.getTimezoneOffset()
  ed = new Date(ed.getTime() - (tz_offset * 60 * 1000))
  const end_date = ed.toISOString().split('T')[0]
  let month = ed.getMonth()
  month = month === 0 ? 12 : month - 1
  ed.setMonth(month)

  const start_date = ed.toISOString().split('T')[0]
  
  const data = await client.transactionsGet({
    access_token,
    start_date,
    end_date
  })

  console.log(start_date, end_date)

  const institution_id = data.data.item.institution_id as string

  const insitution_data = (await client.institutionsGetById({
    institution_id,
    country_codes: ["US" as CountryCode],
    options: {
      include_optional_metadata: true
    }
  })).data.institution

  const plaidAccounts = data.data.accounts
  const accounts: AccountsCollection = {}

  for(let acc of plaidAccounts) {

    const current_balance = acc.balances.current;

    const r: ResponseAccount = {
      acc_num: acc.mask as string,
      acc_name: acc.name,
      balance: current_balance as number,
      ins_name: insitution_data.name,
      ins_logo: insitution_data.logo as string
    }

    if (accounts[acc.type]) {
      accounts[acc.type]!.push(r)
    } else {
      accounts[acc.type] = [r]
    }
  }

  const transactions: ResponseTransaction[] = data.data.transactions.map(t => {
    return {
      amount: t.amount,
      name: t.name,
      date: t.date,
      payment_metadata: {
        payment_channel: t.payment_channel
      }
    }
  })

  res.send({
    accounts,
    transactions
  })
})

router.get('/balance', async (req: Request, res: Response) => {

  const response = await client.accountsBalanceGet({
    // @ts-ignore
    access_token: global.access_token
  })

  res.json({
    balance: response.data
  })
})

export const linkRouter = router
import {
  Request,
  Response,
  Router
} from "express";
import {
  AccountType,
  CountryCode,
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  TransactionsGetResponse,
  AccountSubtype
} from "plaid";

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

import {
  Prisma,
  PrismaClient
} from "@prisma/client";
import {
  Decimal
} from "@prisma/client/runtime";
const prisma = new PrismaClient();

const client = new PlaidApi(configuration);

interface ResponseAccount {
  acc_num: string
  acc_name: string
  ins_name: string
  ins_logo: string
  balance: number
}

// interface PlaidAccountsType{
//   accounts: Prisma.AccountsCollection
//   item: 

// }

type AccountsCollection = {
  [key in AccountType] ? : ResponseAccount[]
}

interface ResponseTransaction {
  amount: number
  name: string
  date: string
  payment_metadata: Record < string, number | string >
}

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
  try {
    const response = await client.itemPublicTokenExchange({
      public_token: req.body.public_token
    })

    const access_token = response.data.access_token;

    // const uniqueid: number = parseInt(req.headers.uniqueid);
    const uniqueidHeader = req.headers.uniqueid as string;

    let uniqueid: number = parseInt(uniqueidHeader);

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

    console.log(start_date, end_date, JSON.stringify(data.data))

    // await storeInDB(uniqueid, data.data, access_token);

    const institution_id = data.data.item.institution_id as string

    const insitution_data = (await client.institutionsGetById({
      institution_id,
      country_codes: ["US" as CountryCode],
      options: {
        include_optional_metadata: true
      }
    })).data.institution

    await storeInDB(uniqueid, data.data, access_token, insitution_data);

    const plaidAccounts = data.data.accounts
    const accounts: AccountsCollection = {}

    for (let acc of plaidAccounts) {

      const current_balance = acc.balances.current;

      const r: ResponseAccount = {
        acc_num: acc.mask as string,
        acc_name: acc.name,
        balance: current_balance as number,
        ins_name: insitution_data.name,
        ins_logo: insitution_data.logo as string
      }

      if (accounts[acc.type]) {
        accounts[acc.type] !.push(r)
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
  } catch (error) {
    console.log(error)
    // res.send({}).co
    res.status(500).send({
      message: "Something went wrong. Try again.",
    });
  }
})

const storeInDB = async (userid: number, plaidAccountsData: TransactionsGetResponse, access_token: string, insitution_data: any) => {
  try{
  const itemData = await prisma.item.findUnique({
    where: {
      item_id: plaidAccountsData.item.item_id,
    },
    select: {
      item_id: true
    },
  });

  if (!itemData) {
    await prisma.item.create({
      data: {
        item_id: plaidAccountsData.item.item_id as string,
        access_token: access_token as string,
        user_id: userid as number
      }
    });
  }

  const instutionData = await prisma.institution.findUnique({
    where: {
      institution_id: plaidAccountsData.item.institution_id as string,
    },
    select: {
      institution_id: true
    },
  });

  if (!instutionData) {
    await prisma.institution.create({
      data: {
        institution_id: plaidAccountsData.item.institution_id as string,
        name: insitution_data.name as string,
      }
    });
  }

  let accounts = [];

  for (let acc of plaidAccountsData.accounts) {
    let r = {
      account_id: acc.account_id as string,
      name: acc.name as string,
      official_name: acc.official_name as string,
      available_balance: acc.balances.available_balance as Decimal,
      current_balance: acc.balances.current_balance as Decimal,
      limit: acc.balances.limit,
      type: acc.type as string,
      subtype: acc.subtype as string,
      institution_id: plaidAccountsData.item.institution_id as string,
      mask: acc.mask as string,
      persistent_account_id: acc.account_id as string,
      item_id: plaidAccountsData.item.item_id
    }
    accounts.push(r)
  }

  for (const acc of accounts) {
    await prisma.account.create({
      data: {
        ...acc
        // item: { connect: { item_id: acc.item_id } },
        // name: account.name,
      },
    });
  }
  return true;
  }catch(error){
    // reject()
    return false;
  } 
}

export const linkRouter = router
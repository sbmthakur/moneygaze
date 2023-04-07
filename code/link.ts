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

import {
  verify
} from "jsonwebtoken";

const JWTsecret = process.env.JWTSEC as string;

const router = Router();

export interface TokenInterface {
  _id: number;
  email: string;
}

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
const prisma = new PrismaClient();

const client = new PlaidApi(configuration);

interface ResponseAccount {
  acc_num: string
  acc_name: string
  ins_name: string
  ins_logo: string
  balance: number
}

type AccountsCollection = {
  [key in AccountType] ? : ResponseAccount[]
}

interface AccountsCollectionNew {
  [key: string]: ResponseAccount[];
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

    const uniqueidHeader = req.headers.uniqueid as string;
    let uniqueid: number = parseInt(uniqueidHeader);

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

    const institution_id = data.data.item.institution_id as string

    const insitution_data = (await client.institutionsGetById({
      institution_id,
      country_codes: ["US" as CountryCode],
      options: {
        include_optional_metadata: true
      }
    })).data.institution

    let storedInDatabaseResponse = await storeInDB(uniqueid, data.data, access_token, insitution_data);

    if(!storedInDatabaseResponse){
      throw new Error("Some issue occured while storing in database")
    }

    let resData = await fetchUserAccountAndTransactions(uniqueid, req);
    if (!resData.accounts){
      return res.status(204).send(resData)
    }

    return res.send(resData)

  } catch (error: any) {
    console.log(error)
    if (error.message === "Request failed with status code 400") {
      res.status(400).send({
        message: "Exchange is invalid or expired.",
      });
    } else {
      res.status(500).send({
        message: "Something went wrong. Try again.",
      });
    }
  }
})

const storeInDB = async (userid: number, plaidAccountsData: TransactionsGetResponse, access_token: string, insitution_data: any): Promise < Boolean > => {
  // await prisma.item.deleteMany({});
  try {
    const val = await prisma.item.upsert({
      where: {
        item_id: plaidAccountsData.item.item_id as string,
      },
      update: {
        // item_id: plaidAccountsData.item.item_id as string,
        access_token: access_token as string,
        user_id: userid as number
      },
      create: {
        item_id: plaidAccountsData.item.item_id as string,
        access_token: access_token as string,
        user_id: userid as number
      }
    });

    await prisma.institution.upsert({
      where: {
        institution_id: plaidAccountsData.item.institution_id as string,
      },
      update: {
        name: insitution_data.name as string,
      },
      create: {
        institution_id: plaidAccountsData.item.institution_id as string,
        name: insitution_data.name as string,
      }
    });

    let accounts = [];

    for (let acc of plaidAccountsData.accounts) {
      let r = {
        account_id: acc.account_id as string,
        name: acc.name as string,
        official_name: acc.official_name as string,
        available_balance: Number(acc.balances.available) as number,
        current_balance: Number(acc.balances.current) as number,
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
      await prisma.account.upsert({
        where: {
          account_id: acc.account_id as string,
        },
        update: {
          name: acc.name as string,
          official_name: acc.official_name as string,
          available_balance: Number(acc.available_balance) as number,
          current_balance: Number(acc.current_balance) as number,
          limit: acc.limit,
          type: acc.type as string,
          subtype: acc.subtype as string,
          institution_id: plaidAccountsData.item.institution_id as string,
          mask: acc.mask as string,
          persistent_account_id: acc.account_id as string,
          item_id: plaidAccountsData.item.item_id
        },
        create: {
          ...acc
        },
      });
    }

    let transactionsData: {
      transaction_id: string;name: string;payment_channel: string;account_id: string;amount: number;category: string;date: string;
    } [] = [];

    plaidAccountsData.transactions.map(trans => {
      transactionsData.push({
        transaction_id: trans.transaction_id,
        name: trans.name,
        payment_channel: trans.payment_channel,
        account_id: trans.account_id,
        amount: trans.amount,
        category: trans.category?.[0] || '',
        date: trans.date
      })
    })

    await Promise.all(transactionsData.map(async (t) => {
      await prisma.transaction.upsert({
        where: {
          transaction_id: t.transaction_id as string,
        },
        update: {
          name: t.name,
          payment_channel: t.payment_channel,
          account_id: t.account_id,
          amount: t.amount,
          category: t.category?.[0] || '',
          date: t.date
        },
        create: {
          ...t
        },
      });
    }));
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

export const fetchUserAccountAndTransactions = async (userid: number, request: Request) => {

  const payload = verify(request.headers.ssotoken as string, JWTsecret);

  if ((payload as TokenInterface)._id != userid) {
    throw new Error("Token invalid for the user.")
  }

  const itemData: string[] = [];
  (await prisma.item.findMany({
    where: {
      user_id: userid
    },
    select: {
      item_id: true
    }
  })).map(res => {
    itemData.push(res.item_id)
  })

  if (itemData.length == 0){
    return {}
  }
  const accountData = await prisma.account.findMany({
    where: {
      item_id: {
        in: itemData
      }
    },
    distinct: ['account_id'],
    include: {
      institution: {
        select: {
          name: true
        }
      }
    }
  })

  let accountIdForTranscation: string[] = [];
  const accounts: AccountsCollectionNew = {}

  for (let acc of accountData) {
    accountIdForTranscation.push(acc.account_id);
    const r: ResponseAccount = {
      acc_num: acc.mask as string,
      acc_name: acc.name,
      balance: Number(acc.current_balance) as number,
      ins_name: acc.institution.name,
      ins_logo: 'insitution_data.logo' as string
    }

    if (accounts[acc.type]) {
      accounts[acc.type] !.push(r)
    } else {
      accounts[acc.type] = [r]
    }
  }

  const transcationData = await prisma.transaction.findMany({
    where: {
      account_id: {
        in: accountIdForTranscation
      }
    },

    orderBy: {
      date: 'desc'
    },
    skip: 0,
    take: 100
  });

  const transactions: ResponseTransaction[] = transcationData.map(t => {
    return {
      amount: Number(t.amount),
      //@ts-ignore
      name: t.name || '',
      date: t.date,
      payment_metadata: {
        //@ts-ignore
        payment_channel: t.payment_channel
      }
    }
  })

  return {
    accounts,
    transactions
  };
};

export const linkRouter = router
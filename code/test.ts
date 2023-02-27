import assert from 'assert'
import sinon, { SinonStubbedInstance } from 'sinon'
import { Request } from "express";
import { fetchUserData } from './user';
import { RequestWithPrisma } from './server';
import { PrismaClient } from '@prisma/client';

describe('User', () => {
    let reqStub: SinonStubbedInstance<Request>
    let prismaClientStub: PrismaClient

    beforeEach(() => {
        
        prismaClientStub = {
            //@ts-ignore
            user: {}
        }
        reqStub = sinon.createStubInstance(Request) as unknown as SinonStubbedInstance<RequestWithPrisma>
        (reqStub as unknown as RequestWithPrisma).prisma = prismaClientStub


    })

    it('findUnique must return the expected userdata', async () => {

        const fakeData = {
            user_id: 1,
            email: 'a@b.com',
            password: '12445'
        }

        prismaClientStub.user.findUnique = sinon.stub().resolves(fakeData)
        const data = await fetchUserData('a@b.com', reqStub);
        assert.deepEqual(data, fakeData)
    })
});
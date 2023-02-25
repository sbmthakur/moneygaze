import assert from 'assert'
import sinon, { SinonStubbedInstance } from 'sinon'
import { Request, Response } from "express";
///import { fetchUserData } from './user';
import { fetchUserData, UserData } from './user';
import { RequestWithPrisma } from './server';
import { PrismaClient } from '@prisma/client';
//const prismaClient = new PrismaClient()
//import proxyquire from "proxyquire";

/*
class MyClass {
    constructor() {
        return sinon.createStubInstance(PrismaClient)
    }
}
*/

describe('User', () => {
    //let sandbox;
    let reqStub: SinonStubbedInstance<Request>
    let prismaClientStub: PrismaClient
    let prismaStub: PrismaClient

    beforeEach(() => {
        
        prismaStub = new PrismaClient()
        reqStub = sinon.createStubInstance(Request) as unknown as SinonStubbedInstance<RequestWithPrisma>
        (reqStub as unknown as RequestWithPrisma).prisma = prismaStub

//        prismaStub = sinon.createStubInstance(PrismaClient)


    })

    it('findUnique must return the expected userdata', async () => {

        /*
        const { fetchUserData: fetchUserMock } = proxyquire('./user', {
            '@prisma/client': {
                PrismaClient: prismaStub
            }
        })
        */
        //let pc = new PrismaClient()

        //console.log(fetchUserMock.toString())

        const fakeData = {
            user_id: 1,
            email: 'a@b.com',
            password: '12445'
        }
        prismaStub.user.findUnique = sinon.stub().resolves(fakeData)
        //prismaClientStub.user.findUnique = sinon.stub().resolves(fakeData)
        const data = await fetchUserData('a@b.com', reqStub);
        ///const data = await fetchUserMock('a@b.com', reqStub);
        assert.deepEqual(data, fakeData)
/*
        prismaStub.user.findUnique = sinon.stub().resolves(fakeData)
        const data = await fetchUserData('a@b.com', reqStub);
        assert.deepEqual(data, fakeData)
        */
    })
    /*
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
    */
});
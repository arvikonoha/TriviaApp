const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const MOCK_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWM3YWQ4YTlmMDRlMWM5YjgwMjgxMDMiLCJpYXQiOjE3MDg3NTc0MzMsImV4cCI6MTcwODc2MTAzM30.FRa-rjceEZuEQydiZWvxUjAXl5VGaPCinzx6T2CcHmwkwvlX4CV71ZneWOmiZyfGEOOPbedlQilZ9UtgpYZNAR_1M6Q6H8mvqdm802uQZfdMa_3h0YttBzOIsbTXOyCrd6pPICbD4uwZF8RTHBnJPF8OeDtE7hGJJeS1A-fIw897W9cf6LB74TUkSCe7x0m_aN1YQWUPXy6N_SZgtaoevrDna00xhR2hFTjyZwljP0U0OshelPvoOeyUYmmgzGTBfsbz9LgzUYLpbtteZfyKN9RPvOvnOeDe4SQ18X_oUnCvYTAnrQsONE6EfhcJ4gTGQ29hLqDzQT68Tp3Mi0MIBw'
const MOCK_USER_ID = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';
const MOCK_USER = {
    name: 'Aravinda',
    password: 'Trever.Phillips'
}
const fs = require('fs');
const authController = require('../../../controllers').auth
const orm = require('../../../orm')


describe('Auth controller', () => {
    describe('Login controller', () => {
        let axiosStub = null
        let ormCreateStub = null
        let ormNameStub = null
        beforeEach(() => {
            axiosStub = sinon.stub(axios, 'post')
            ormCreateStub = sinon.stub(orm.users, 'create')
            ormNameStub = sinon.stub(orm.users, 'findByName')
        })
        afterEach(() => {
            sinon.restore()
        })
        it('Should login successfully when correct credentials are passed, and user already exists', async () => {
            axiosStub.resolves({status: 200, data: {token: MOCK_TOKEN, user: {_id: MOCK_USER_ID, name: MOCK_USER.name}}})
            ormNameStub.resolves({name: MOCK_USER.name, _id: MOCK_USER_ID})
            const mRes = {
                json: sinon.stub()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()

            const mReq = {
                body: MOCK_USER
            }
            await authController.login(mReq, mRes)
            expect(axiosStub.calledOnce).to.be.true
            expect(ormNameStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(200)).to.be.true
            expect(mRes.json.calledWith({token: MOCK_TOKEN})).to.be.true
        }
        )
        it('Should login successfully when correct credentials are passed, and user does not exist', async () => {
            axiosStub.resolves({status: 200, data: {token: MOCK_TOKEN, user: {_id: MOCK_USER_ID, name: MOCK_USER.name}}})
            ormNameStub.resolves(null)
            ormCreateStub.resolves({_id: MOCK_USER_ID, name: MOCK_USER.name})
            const mRes = {
                json: sinon.stub()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()

            const mReq = {
                body: MOCK_USER
            }
            await authController.login(mReq, mRes)
            expect(axiosStub.calledOnce).to.be.true
            expect(ormNameStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(200)).to.be.true
            expect(mRes.json.calledWith({token: MOCK_TOKEN})).to.be.true
        })

        it('Should handle failure gracefully when incorrect credentials are passed', async () => {
            axiosStub.resolves({status: 400, data: {error: 'Invalid credentials'}})
            const mRes = {
                json: sinon.stub()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()

            const mReq = {
                body: MOCK_USER
            }
            await authController.login(mReq, mRes)
            expect(axiosStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(400)).to.be.true
            expect(mRes.json.calledWith({error: 'Invalid credentials'})).to.be.true
        })

        it('Should handle failure gracefully when axios fails', async () => {
            const customError = {error: 'Invalid payload'}
            axiosStub.rejects(customError)
            const mRes = {
                json: sinon.stub()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                body: MOCK_USER
            }
            await authController.login(mReq, mRes)
            expect(axiosStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(500)).to.be.true
            expect(mRes.json.calledWith({error: 'Internal server error'})).to.be.true
        
        })
    })  
    
    describe('Register controller', () => {
        let axiosStub = null
        let ormCreateStub = null
        beforeEach(() => {
            axiosStub = sinon.stub(axios, 'post')
            ormCreateStub = sinon.stub(orm.users, 'create')
            ormNameStub = sinon.stub(orm.users, 'findByName')
        })
        afterEach(() => {
            sinon.restore()
        })
        it('Should handle gracefully when user already exists', async () => {
            axiosStub.resolves({status: 400, data: {error: 'User already exists for the given username'}})
            const mRes = {
                json: sinon.spy()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                body: MOCK_USER
            }
            await authController.register(mReq, mRes)
            expect(mRes.status.calledWith(400)).to.be.true
            expect(mRes.json.calledWith({error: 'User already exists for the given username'})).to.be.true
        })

        it('Should save used successfully', async () => {
            axiosStub.resolves({status: 200, data: {token: MOCK_TOKEN, user: {_id: MOCK_USER_ID, name: MOCK_USER.name}}})
            ormCreateStub.returns(Promise.resolve(MOCK_USER))
            const mRes = {
                json: sinon.spy()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                body: MOCK_USER
            }
            await authController.register(mReq, mRes)
            expect(axiosStub.calledOnce).to.be.true
            expect(ormCreateStub.calledOnce).to.be.true
            expect(mRes.json.calledWith({token: MOCK_TOKEN})).to.be.true
        })

        
        it('Should handle failure gracefully when axios fails', async () => {
            const customError = {error: 'Invalid payload'}
            axiosStub.rejects(customError)
            const mRes = {
                json: sinon.stub()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                body: MOCK_USER
            }
            await authController.login(mReq, mRes)
            expect(axiosStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(500)).to.be.true
            expect(mRes.json.calledWith({error: 'Internal server error'})).to.be.true
        
        })

    })  
})
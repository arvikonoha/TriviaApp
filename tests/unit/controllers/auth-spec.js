const sinon = require('sinon')
const jwt = require('jsonwebtoken')
const MOCK_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWM3YWQ4YTlmMDRlMWM5YjgwMjgxMDMiLCJpYXQiOjE3MDg3NTc0MzMsImV4cCI6MTcwODc2MTAzM30.FRa-rjceEZuEQydiZWvxUjAXl5VGaPCinzx6T2CcHmwkwvlX4CV71ZneWOmiZyfGEOOPbedlQilZ9UtgpYZNAR_1M6Q6H8mvqdm802uQZfdMa_3h0YttBzOIsbTXOyCrd6pPICbD4uwZF8RTHBnJPF8OeDtE7hGJJeS1A-fIw897W9cf6LB74TUkSCe7x0m_aN1YQWUPXy6N_SZgtaoevrDna00xhR2hFTjyZwljP0U0OshelPvoOeyUYmmgzGTBfsbz9LgzUYLpbtteZfyKN9RPvOvnOeDe4SQ18X_oUnCvYTAnrQsONE6EfhcJ4gTGQ29hLqDzQT68Tp3Mi0MIBw'
const MOCK_USER_ID = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';
const MOCK_USER = {
    name: 'Aravinda',
    password: 'Trever.Phillips'
}
const authController = require('../../../controllers').auth
const orm = require('../../../orm')


describe('Auth controller', () => {
    describe('Login controller', () => {
        let jwtStub = null
        beforeEach(() => {
            jwtStub = sinon.stub(jwt, 'sign')
        })
        afterEach(() => {
            sinon.restore()
        })
        it('Should login successfully when jwt payload is valid', async () => {
            jwtStub.returns(MOCK_TOKEN)
            const mRes = {
                json: sinon.spy()
            }
            const mReq = {
                user: {
                    id: MOCK_USER_ID
                }
            }
            await authController.login(mReq, mRes)
            expect(jwtStub.calledOnce).to.be.true
            expect(mRes.json.calledWith({token: MOCK_TOKEN})).to.be.true
        })

        it('Should handle failure gracefully when jwt payload is invalid', async () => {
            const customError = {error: 'Invalid payload'}
            jwtStub.throws(customError)
            const mRes = {
                json: sinon.spy()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                user: {
                    id: MOCK_USER_ID
                }
            }
            await authController.login(mReq, mRes)
            expect(jwtStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(500)).to.be.true
            expect(mRes.json.calledWith({error: 'Internal server error'})).to.be.true
        
        })
    })  
    
    describe('Register controller', () => {
        let jwtStub = null
        let ormFindByName = null
        let ormSaveUser = null
        beforeEach(() => {
            jwtStub = sinon.stub(jwt, 'sign')
            ormFindByName = sinon.stub(orm.users, 'findByName')
            ormSaveUser = sinon.stub(orm.users, 'saveUser')
        })
        afterEach(() => {
            sinon.restore()
        })
        it('Should handle gracefully when user already exists', async () => {
            ormFindByName.returns(Promise.resolve(MOCK_USER))
            const mRes = {
                json: sinon.spy()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                body: MOCK_USER
            }
            await authController.register(mReq, mRes)
            expect(ormFindByName.calledWith(MOCK_USER.name)).to.be.true
            expect(mRes.status.calledWith(400)).to.be.true
            expect(mRes.json.calledWith({message: 'User already exists'})).to.be.true
        })

        it('Should save used successfully', async () => {
            ormFindByName.returns(null)
            ormSaveUser.returns(Promise.resolve(MOCK_USER))
            jwtStub.returns(MOCK_TOKEN)
            const mRes = {
                json: sinon.spy()        
            }
            const mReq = {
                body: MOCK_USER
            }
            await authController.register(mReq, mRes)
            expect(ormFindByName.calledWith(MOCK_USER.name)).to.be.true
            expect(ormSaveUser.calledOnce).to.be.true
            expect(jwtStub.calledOnce).to.be.true
            expect(mRes.json.calledWith({token: MOCK_TOKEN})).to.be.true
        })

        
        it('Should handle failure gracefully when jwt payload is invalid', async () => {
            
            ormFindByName.returns(null)
            ormSaveUser.returns(Promise.resolve(MOCK_USER))
            
            const customError = {error: 'Invalid payload'}
            jwtStub.throws(customError)
            const mRes = {
                json: sinon.spy()        
            }
            mRes.status = sinon.stub().returns(mRes)
            mRes.json = sinon.stub()
            
            const mReq = {
                body: MOCK_USER
            }
            await authController.register(mReq, mRes)
            expect(jwtStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(500)).to.be.true
            expect(mRes.json.calledWith({error: 'Internal server error'})).to.be.true
        
        })

    })  
})
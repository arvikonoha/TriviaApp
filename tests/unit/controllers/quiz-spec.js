const orm = require('../../../orm')
const sinon = require('sinon')
const quizController = require('../../../controllers/quiz')
const quizMockData = require('./quizTestData.json')
const crypto = require('crypto')

describe('Quiz controller', () => {
    describe('Get quiz', () => {
        let ormListStub = null;
        beforeEach(() => {
            ormListStub = sinon.stub(orm.quiz, 'list')
        })
        afterEach(() => {
            sinon.restore()
        })

        it('Should get the quiz when quiz ID is passed', async () => {
            ormListStub.resolves(quizMockData.getById)
            const mRes = {
                json: sinon.spy()
            }
            const mReq = {
                params: {
                    id: '65c8b120e3aacaa8401f115b'
                }
            }
            await quizController.get(mReq, mRes)
            expect(ormListStub.calledWith({_id: mReq.params.id}, 0, {
                title: 1,
                category: 1,
                _id: 1,
                time: 1,
                'questions._id': 1,
                'questions.title': 1,
                'questions.description': 1,
                'questions.options.description': 1,
            }))
            expect(mRes.json.calledWith(quizMockData.getById))
        })

        it('Should get the quiz when quiz filter is passed', async () => {
            ormListStub.resolves(quizMockData.get)
            const mRes = {
                json: sinon.spy()
            }
            const mReq = {
                params: {},
                query: {
                    page: 2,
                    title: 'General knowledge'
                }
            }
            await quizController.get(mReq, mRes)
            expect(ormListStub.calledWith({
                title: mReq.query.title
            }, 2, 'title _id category'))
            expect(mRes.json.calledWith(quizMockData.get))
        })

        it('Should handle orm failures gracefully', async () => {
            ormListStub.rejects({message: 'ORM failed'})
            const mRes = {
                json: sinon.stub(),
                status: sinon.stub()
            }
            mRes.status.returns(mRes)
            const mReq = {
                params: {},
                query: {
                    page: 2,
                    title: 'General knowledge'
                }
            }
            await quizController.get(mReq, mRes)
            expect(ormListStub.calledWith({
                title: mReq.query.title
            }, 2, 'title _id category'))
            expect(mRes.status.calledWith(500))
            expect(mRes.json.calledWith({message: 'Internal server error'}))
        })
    })

    describe('Post quiz', () => {
        let ormCreateStub = null
        let cryptoSpy = null
        beforeEach(() => {
            ormCreateStub = sinon.stub(orm.quiz, 'create')
            cryptoSpy = sinon.spy(crypto, 'createHash')
        })
        afterEach(() => {
            sinon.restore()
        })
        it('Should create the quiz successfully', async () => {
            const mRes = {
                json: sinon.spy()
            }
            const mReq = {
                body: quizMockData.getById.quizlist[0]
            }
            ormCreateStub.resolves(mReq.body)
            await quizController.post(mReq, mRes)

            expect(cryptoSpy.calledOnce).to.be.true
            expect(ormCreateStub.calledOnce).to.be.true
            expect(mRes.json.calledOnce).to.be.true
            expect(mRes.json.calledWith({error:'Internal server error'})).to.be.not.true
        })
        it('Should handles orm failures gracefully', async () => {
            const mRes = {
                json: sinon.spy(),
                status: sinon.stub()
            }
            mRes.status.returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                body: quizMockData.getById.quizlist[0]
            }
            ormCreateStub.rejects(new Error("ORM Failed"))
            await quizController.post(mReq, mRes)

            expect(cryptoSpy.calledOnce).to.be.true
            expect(ormCreateStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(500)).to.be.true
            expect(mRes.json.calledOnce).to.be.true
            expect(mRes.json.calledWith({error:'Internal server error'})).to.not.true
        })
    })

    describe('Quiz submissions', () => {
        let ormListStub = null
        beforeEach(() => {
            ormListStub = sinon.stub(orm.solution, 'listSubmissions')
        })
        afterEach(() => {
            sinon.restore()
        })
        it('Should list the quiz submissions successfully', async () => {
            const mRes = {
                json: sinon.spy()
            }
            const mReq = {
                params: {id: 2},
                user: {id: 4}
            }
            ormListStub.resolves(quizMockData.listSubmissions)
            await quizController.submissions(mReq, mRes)

            expect(ormListStub.calledOnce).to.be.true
            expect(mRes.json.calledOnce).to.be.true
            expect(mRes.json.calledWith(quizMockData.listSubmissions)).to.be.true
            expect(mRes.json.calledWith({error:'Internal server error'})).to.be.not.true
        })
        it('Should handles orm failures gracefully', async () => {
            const mRes = {
                json: sinon.spy(),
                status: sinon.stub()
            }
            mRes.status.returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                params: {id: 2},
                user: {id: 4}
            }
            ormListStub.rejects(new Error("ORM Failed"))
            await quizController.submissions(mReq, mRes)

            expect(ormListStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(500)).to.be.true
            expect(mRes.json.calledOnce).to.be.true
            expect(mRes.json.calledWith({error:'Internal server error'})).to.not.true
        })
    })

    describe('Quiz leaderboards', () => {
        let ormListStub = null
        beforeEach(() => {
            ormListStub = sinon.stub(orm.solution, 'listRankings')
        })
        afterEach(() => {
            sinon.restore()
        })
        it('Should list the quiz submissions successfully', async () => {
            const mRes = {
                json: sinon.spy()
            }
            const mReq = {
                params: {id: 2},
            }
            ormListStub.resolves(quizMockData.listSubmissions)
            await quizController.leaderboard(mReq, mRes)

            expect(ormListStub.calledOnce).to.be.true
            expect(mRes.json.calledOnce).to.be.true
            expect(mRes.json.calledWith(quizMockData.listSubmissions)).to.be.true
            expect(mRes.json.calledWith({error:'Internal server error'})).to.be.not.true
        })
        it('Should handles orm failures gracefully', async () => {
            const mRes = {
                json: sinon.spy(),
                status: sinon.stub()
            }
            mRes.status.returns(mRes)
            mRes.json = sinon.stub()
            const mReq = {
                params: {id: 2},
                user: {id: 4}
            }
            ormListStub.rejects(new Error("ORM Failed"))
            await quizController.leaderboard(mReq, mRes)

            expect(ormListStub.calledOnce).to.be.true
            expect(mRes.status.calledWith(500)).to.be.true
            expect(mRes.json.calledOnce).to.be.true
            expect(mRes.json.calledWith({error:'Internal server error'})).to.not.true
        })
    })
})
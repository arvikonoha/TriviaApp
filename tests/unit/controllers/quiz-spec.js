const orm = require('../../../orm')
const sinon = require('sinon')
const quizController = require('../../../controllers/quiz')
const quizMockData = require('./quizTestData.json')

describe('Quiz controller', () => {
    describe('Get the quiz by ID', () => {
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
            expect(mRes.json.calledWith(quizMockData.getById))
        })
    })

    describe('Get the quiz by ID', () => {
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
})
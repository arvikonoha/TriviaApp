const Quiz = require("../models/Quiz")

module.exports.list = async function list(filter, page, select) {
    const totalCount = await Quiz.countDocuments(filter);
    const categories = await Quiz.distinct('category');
    const quizlist = await Quiz.find(filter).skip(page*20).limit(20).select(select)
    return ({
        totalCount,
        quizlist,
        categories
    })
}

module.exports.create = async function create(quizDetails) {
    return Quiz.findOneAndUpdate({
        hash: quizDetails.hash
    }, {$set: quizDetails}, {upsert: true})
}

module.exports.createMany = async function createMany(quizList) {
    return Quiz.insertMany(quizList, { ordered: false })
}
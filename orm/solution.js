const Solution = require("../models/Solution")
const mongoose = require('mongoose')
const queries = require('./queries')

module.exports.create = function create(solutionDetails) {
    const solutionDoc = new Solution(solutionDetails)
    return solutionDoc.save()
}

module.exports.listSubmissions = function listSubmissions(user, quizID) {

    const userObjectId = new mongoose.Types.ObjectId(user);
    const quizObjectId = new mongoose.Types.ObjectId(quizID);
    // Match stage
    const matchStage = {
        $match: {
            author: userObjectId,
            quizID: quizObjectId
        }
    };

    // Sort stage
    const sortStage = {
        $sort: { _id: 1 }
    };

    // Combine all stages
    const pipeline = [
        matchStage,
        sortStage,
        queries.solution.lookUpStage,
        queries.solution.unwindStage,
        queries.solution.projectStage,
        queries.solution.updateActualAnswerStage,
        queries.solution.calculateScoreStage,
    ];

    return Solution.aggregate(pipeline).exec()
}

/**
 * Get the author with max score as per the above logic
 */


module.exports.listRankings = function listRankings(quizID=null) {

    // Match stage
    const matchStage = {
        $match: {},
    };;

    const groupStage = {
        $group: {
            _id: '$author', // Group by author.id
            totalScore: { $sum: '$score' }
        }
    }
    if (quizID) {
        matchStage.$match = {
            quizID: new mongoose.Types.ObjectId(quizID)
        }
    }

    const sortStage = {
        $sort: {
            totalScore: -1
        }
    }

    const modifiedProjectStage = JSON.parse(JSON.stringify({
        $project: {
            ...queries.solution.projectStage.$project,
            author: '$author',
        }
    }))
    
    
    // Combine all stages
    const pipeline = [
        matchStage,
        queries.solution.lookUpStage,
        queries.solution.unwindStage,
        modifiedProjectStage,
        queries.solution.updateActualAnswerStage,
        queries.solution.calculateScoreStage,
        groupStage,
        sortStage,
        /* */
        queries.solution.userLookUpStage,
        queries.solution.userUnwindStage,
        {
            $project: {
                _id: 1,
                name: "$authorDetails.name",
                totalScore: 1
            }
        }
        /* */
    ];

    return Solution.aggregate(pipeline.filter(Boolean)).exec()
}
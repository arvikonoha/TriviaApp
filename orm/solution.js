const Solution = require("../models/Solution")
const mongoose = require('mongoose')
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

    // Lookup stage
    const lookupStage = {
        $lookup: {
            from: 'quizzes',
            localField: 'quizID',
            foreignField: '_id',
            as: 'quiz'
        }
    };

    // Unwind stage
    const unwindStage = {
        $unwind: '$quiz'
    };

    // Project stage
    const projectStage = {
        $project: {
            answers: {
                $map: {
                    input: '$answers',
                    as: 'selectedAnswer',
                    in: {
                        title: '$$selectedAnswer.title',
                        answer: '$$selectedAnswer.answer',
                        actualAnswer: {
                            $arrayElemAt: [
                                {
                                    $filter: {
                                        input: '$quiz.questions',
                                        as: 'question',
                                        cond: {
                                            $eq: ['$$question.title', '$$selectedAnswer.question']
                                        }
                                    }
                                },
                                0
                            ]
                        }
                    }
                }
            }
        }
    };

    // Update actualAnswer stage
    const updateActualAnswerStage = {
        $addFields: {
            answers: {
                $map: {
                    input: '$answers',
                    as: 'selectedAnswer',
                    in: {
                        title: '$$selectedAnswer.title',
                        selectedAnswer: '$$selectedAnswer.answer',
                        actualAnswer: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: '$$selectedAnswer.actualAnswer.options',
                                        as: 'option',
                                        in: {
                                            $cond: {
                                                if: { $eq: ['$$option.isAnswer', 'true'] },
                                                then: '$$option.description',
                                                else: null
                                            }
                                        }
                                    }
                                },
                                0
                            ]
                        }
                    }
                }
            }
        }
    };

    // Calculate score stage
    const calculateScoreStage = {
        $addFields: {
            score: {
                $sum: {
                    $map: {
                        input: '$answers',
                        as: 'answer',
                        in: {
                            $cond: {
                                if: { $eq: ['$$answer.selectedAnswer', '$$answer.actualAnswer'] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                }
            }
        }
    };

    // Combine all stages
    const pipeline = [
        matchStage,
        sortStage,
        lookupStage,
        unwindStage,
        projectStage,
        updateActualAnswerStage,
        calculateScoreStage
    ];

    return Solution.aggregate(pipeline).exec()
}

/**
 * Get the author with max score as per the above logic
 */
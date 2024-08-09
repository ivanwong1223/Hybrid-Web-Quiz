import Question from "../models/questionModel.js"; 
import Quizzes from "../models/quizzesModel.js"; 
import { Op } from "sequelize";


// Function to get all questions for the same quizID (for history page)
export const getQuestion = async (req, res) => {
    try {
        const quizID = req.query.quizID;
        const response = await Question.findAll({
            attributes: ['questionID', 'questionTitle', 'questionMedia', 'questionChoice1', 'questionChoice2', 'questionChoice3', 'questionChoice4', 'correctAnswer', 'feedback'],
            where: { quizID },
            include: [
                {
                    model: Quizzes,
                    attributes: ['quizTopic', 'quizTotalQuestion'] 
                }
            ]
        });
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Function to get a single question by questionID and quizID
export const getQuestionById = async (req, res) => {
    try {
        const { quizID, questionID } = req.params;  // Destructure params
        const question = await Question.findOne({
            attributes: ['questionID', 'questionTitle', 'questionMedia', 'questionChoice1', 'questionChoice2', 'questionChoice3', 'questionChoice4', 'correctAnswer', 'feedback'],
            where: {
                [Op.and]: [
                    { questionID },
                    { quizID }
                ]
            },
            include: [
                {
                    model: Quizzes,
                    attributes: ['quizTopic', 'quizTotalQuestion']
                }
            ]
        });
        if (!question) return res.status(404).json({ msg: "No questions found for this quiz ID" });

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

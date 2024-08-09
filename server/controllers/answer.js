import Question from "../models/questionModel.js"; 
import Answer from "../models/answerModel.js";
import Leaderboard from "../models/leaderboardModel.js";
import Room from "../models/roomModel.js";

// Function to submit an answer
export const submitAnswer = async (req, res) => {
    const { questionID, selectedChoice } = req.body;
    const studentID = req.session.studentID;

    try {
        // Find the question
        const question = await Question.findByPk(questionID);

        if (!question) {
            return res.status(404).json({ msg: "Question not found" });
        }

        // Determine if the answer is correct
        const answerIsCorrect = selectedChoice === question.correctAnswer ? 'Yes' : 'No';

        // Fetch previous answers by the student
        const previousAnswers = await Answer.findAll({
            where: { studentID },
            order: [['answerID', 'DESC']],
            limit: 2 // We only care about the last two answers
        });

        let winningStreak = 0; // Initialize the winning streak
        let answered_score = 0; // Initialize the score

        // Calculate the winning streak based on previous answers
        if (previousAnswers.length > 0) {
            const [lastAnswer, secondLastAnswer] = previousAnswers;

            if (lastAnswer && lastAnswer.answerIsCorrect === 'Yes') {
                winningStreak = 1;
                if (secondLastAnswer && secondLastAnswer.answerIsCorrect === 'Yes') {
                    winningStreak = 2;
                }
            }
        }

        // Calculate the score based on the answer correctness and winning streak
        if (answerIsCorrect === 'Yes') {
            answered_score = 1;
            if (winningStreak >= 1) {
                answered_score = 2;
            }
        }

        // Double points for the second correct answer in a row
        if (answerIsCorrect === 'Yes' && winningStreak >= 2) {
            answered_score = 2;
        }

        // Insert the answer into the database
        const newAnswer = await Answer.create({
            answerIsCorrect,
            answered_score,
            studentID,
            questionID
        });

        // Find the related roomID from the questionID
        const room = await Room.findOne({
            where: { quizID: question.quizID }
        });

        if (!room) {
            return res.status(404).json({ msg: "Room not found" });
        }

        const roomID = room.roomID;

        // Update the totalScored in the leaderboard
        let totalScored;
        const leaderboardEntry = await Leaderboard.findOne({
            where: {
                studentID,
                roomID
            }
        });

        if (leaderboardEntry) {
            // Add the current answered_score to the totalScored
            totalScored = parseInt(leaderboardEntry.totalScored, 10) + answered_score;

            // Update the leaderboard entry
            await leaderboardEntry.update({
                totalScored
            });
        } else {
            // Create a new leaderboard entry if none exists
            totalScored = answered_score;
            await Leaderboard.create({
                studentID,
                roomID,
                totalScored,
                answered_question: 1
            });
        }

        // Determine the feedback message
        const feedbackMessage = answerIsCorrect === 'Yes' ? "You are correct." : "Incorrect.";

        // Return the feedback along with the answer details
        res.status(201).json({
            answer: newAnswer,
            text: feedbackMessage,
            feedback: question.feedback,
            totalScored
        });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


// Function to get the current score for a student in a room
export const getCurrentScore = async (req, res) => {
    const { quizID } = req.params;
    const studentID = req.session.studentID;

    try {
        // Find the related roomID from the quizID
        const room = await Room.findOne({
            where: { quizID }
        });

        if (!room) {
            return res.status(404).json({ msg: "Room not found" });
        }

        const roomID = room.roomID;

        // Get the leaderboard entry for the student in the room
        const leaderboardEntry = await Leaderboard.findOne({
            where: {
                studentID,
                roomID
            }
        });

        if (!leaderboardEntry) {
            return res.status(200).json({ totalScored: 0 });
        }

        res.status(200).json({ totalScored: leaderboardEntry.totalScored });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

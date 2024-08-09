import { Sequelize } from "sequelize"; // Import Sequelize
import Leaderboard from "../models/leaderboardModel.js";
import Room from "../models/roomModel.js";
import Answer from "../models/answerModel.js";
import Question from "../models/questionModel.js"; // Import Question model
import Quizzes from "../models/quizzesModel.js";
import Users from "../models/student_accModel.js";

export const getLeaderboard = async (req, res) => {
    try {
        const { roomID } = req.params; // Extract roomID from request parameters

        if (!roomID) {
            return res.status(400).json({ msg: "Room ID is required" });
        }

        // Query to get the quizID from the Room model
        const room = await Room.findOne({
            attributes: ['quizID'],
            where: { roomID }
        });

        if (!room) {
            return res.status(404).json({ msg: "Room not found" });
        }

        const quizID = room.quizID;

        // Query to get the leaderboard data
        const leaderboard = await Leaderboard.findAll({
            attributes: [
                'studentID',
                'totalScored',
                'attemptedTime',
                [Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM student_answer sa
                    JOIN quiz_question qq ON sa.questionID = qq.questionID
                    WHERE sa.studentID = quiz_leaderboard.studentID
                    AND sa.answerIsCorrect = 'Yes'
                    AND qq.quizID = ${quizID}
                )`), 'correctAnswersCount']
            ],
            where: { roomID },
            include: [
                {
                    model: Users,
                    attributes: ['studentName']
                },
                {
                    model: Room,
                    attributes: ['quizID'],
                    include: [
                        {
                            model: Quizzes,
                            attributes: ['quizTopic']
                        }
                    ]
                }
            ]
        });

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

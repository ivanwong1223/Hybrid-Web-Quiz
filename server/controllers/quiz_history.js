import Leaderboard from "../models/leaderboardModel.js"; 
import Quizzes from "../models/quizzesModel.js";
import Room from "../models/roomModel.js"; 
import { Op } from "sequelize";

Leaderboard.belongsTo(Room, { foreignKey: 'roomID' });
Room.belongsTo(Quizzes, { foreignKey: 'quizID' });

export const getHistory = async (req, res) => {
    try {
        const response = await Leaderboard.findAll({
            attributes: ['leaderboardID', 'totalScored', 'attemptedTime'],
            where: {
                studentID: req.session.studentID // Use session studentID
            },
            include: [
                {
                    model: Room,
                    attributes: ['quizID', 'quizAttemptedTime'],
                    include: [
                        {
                            model: Quizzes,
                            attributes: ['quizTopic', 'quizTotalQuestion']
                        }
                    ]
                }
            ]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getHistoryById = async (req, res) => {
    try {
        const history = await Leaderboard.findOne({
            attributes: ['leaderboardID', 'totalScored', 'attemptedTime'],
            where: {
                [Op.and]: [
                    { leaderboardID: req.params.leaderboardID },
                    { studentID: req.session.studentID }
                ]
            },
            include: [
                {
                    model: Room,
                    attributes: ['quizID', 'quizAttemptedTime'],
                    include: [
                        {
                            model: Quizzes,
                            attributes: ['quizTopic', 'quizTotalQuestion']
                        }
                    ]
                }
            ]
        });
        if (!history) return res.status(404).json({ msg: "Data not found" });

        const { leaderboardID, totalScored, attemptedTime, room } = history;
        const { quizID, quiz } = room || {};
        const { quizTopic, quizTotalQuestion } = quiz || {};

        res.status(200).json({ leaderboardID, quizID, totalScored, attemptedTime, quizTopic, quizTotalQuestion });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const submitRoomCode = async (req, res) => {
    try {
        const { roomCode } = req.body;
        const studentID = req.session.studentID;

        if (!studentID) {
            return res.status(401).json({ msg: "Please log in to an account!" });
        }

        // Find the room by roomCode
        const room = await Room.findOne({
            where: { roomCode },
            attributes: ['roomID', 'quizID', 'roomCode']
        });

        if (!room) {
            return res.status(404).json({ msg: "Room code are not available" });
        }

        // Get the quiz details using quizID
        const quiz = await Quizzes.findOne({
            where: { quizID: room.quizID },
            attributes: ['quizTopic', 'quizTotalQuestion']
        });

        if (!quiz) {
            return res.status(404).json({ msg: "Quiz not found" });
        }

        // Insert a new row into the quiz_leaderboard table
        const newLeaderboardEntry = await Leaderboard.create({
            roomID: room.roomID,
            studentID,
            totalScored: "0"     // Assuming totalScored should be initialized to "0"
        });

        res.status(201).json({
            newLeaderboardEntry,
            quizID: room.quizID,
            roomCode: room.roomCode,
            quizTopic: quiz.quizTopic,
            quizTotalQuestion: quiz.quizTotalQuestion
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

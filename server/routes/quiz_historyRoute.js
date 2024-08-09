import express from "express";
import {
    getHistory,
    getHistoryById,
    submitRoomCode,
} from "../controllers/quiz_history.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/history', verifyUser, getHistory);
router.get('/history/:leaderboardID', verifyUser, getHistoryById);
router.post('/submitRoomCode', submitRoomCode);

export default router;

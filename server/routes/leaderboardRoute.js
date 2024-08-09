import express from "express";
import {
    getLeaderboard,
} from "../controllers/leaderboard.js";

const router = express.Router();

router.get('/leaderboard/:roomID', getLeaderboard);

export default router;

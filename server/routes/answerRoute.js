import express from "express";
import {
    submitAnswer,
    getCurrentScore,
} from "../controllers/answer.js";

const router = express.Router();

router.post('/submit', submitAnswer);
router.get('/submit/:quizID', getCurrentScore);
//router.post('/question/:quizID/:questionID', getQuestionById);

export default router;

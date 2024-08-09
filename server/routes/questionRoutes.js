import express from "express";
import {
    getQuestion,
    getQuestionById,
} from "../controllers/question.js";

const router = express.Router();

router.get('/question', getQuestion);
router.get('/question/:quizID/:questionID', getQuestionById);

export default router;

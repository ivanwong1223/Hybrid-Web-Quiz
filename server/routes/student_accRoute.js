import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
} from "../controllers/student_acc.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/dashboard', verifyUser, getUsers);
router.get('/dashboard/:studentID', verifyUser, getUserById);
router.post('/registration', createUser);
router.patch('/modify/:studentID', verifyUser, updateUser);

export default router;

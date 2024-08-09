import User from "../models/student_accModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                studentEmail: req.body.studentEmail
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Compare the student passwords from database
        const match = await argon2.verify(user.studentPassword, req.body.studentPassword);
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        
        req.session.studentID = user.studentID;
        
        const studentID = user.studentID;
        const studentName = user.studentName;
        const studentEmail = user.studentEmail;
        
        res.status(200).json({ studentID, studentName, studentEmail });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Function to get user login
export const me = async (req, res) => {
    try {
        if (!req.session.studentID) {
            return res.status(401).json({ msg: "Please log in to your account!" });
        }
        
        const user = await User.findOne({
            attributes: ['studentID', 'studentName', 'studentEmail'],
            where: {
                studentID: req.session.studentID
            }
        });
        
        if (!user) return res.status(404).json({ msg: "User not found" });
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ msg: "Cannot log out" });
        res.status(200).json({ msg: "You have logged out" });
    });
}

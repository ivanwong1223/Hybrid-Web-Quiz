import User from "../models/student_accModel.js";
import argon2 from "argon2";

// Helper function to validate student name
const isValidName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(name);
};


// Get all student
export const getUsers = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: ['studentID', 'studentName', 'studentEmail', 'studentInstitution', 'studentEducation', 'created_at']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Get a student by ID
export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: ['studentID', 'studentName', 'studentEmail', 'studentInstitution', 'studentEducation', 'created_at'],
            where: {
                studentID: req.params.studentID
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Create new student account
export const createUser = async (req, res) => {
    const { studentName, studentEmail, studentPassword, confPassword } = req.body;

    if (!isValidName(studentName)) {
        return res.status(400).json({ msg: "Name cannot consist of integers or special characters" });
    }

    if (studentPassword !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password do not match" });
    }

    try {
        const existingUser = await User.findOne({
            where: { studentEmail: studentEmail }
        });

        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists!" });
        }

        const hashPassword = await argon2.hash(studentPassword);
        await User.create({
            studentName: studentName,
            studentEmail: studentEmail,
            studentPassword: hashPassword
        });
        res.status(201).json({ msg: "Registration Successful" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

// Update student account
export const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                studentID: req.params.studentID
            }
        });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const { studentName, studentEmail, studentPassword, confPassword, studentInstitution, studentEducation, currentPassword  } = req.body;
        let hashPassword;

        if (studentName && !isValidName(studentName)) {
            return res.status(400).json({ msg: "Name cannot consist of integers or special characters" });
        }

        if (studentEmail && studentEmail !== user.studentEmail) {
            const existingUser = await User.findOne({
                where: { studentEmail: studentEmail }
            });

            if (existingUser) {
                return res.status(400).json({ msg: "Email already exists!" });
            }
        }

        // Validate current password before changing to a new password
        if (currentPassword) {
            const validPassword = await argon2.verify(user.studentPassword, currentPassword);
            if (!validPassword) {
                return res.status(400).json({ msg: "Current Password Invalid!" });
            }
        }

        if(studentPassword === "" || studentPassword === null){
            hashPassword = user.studentPassword
        }else{
            if (studentPassword !== confPassword) {
                return res.status(400).json({ msg: "Password and Confirm Password do not match" });
            }
            hashPassword = await argon2.hash(studentPassword);
        }

        const updateData = {
            studentName: studentName || user.studentName,   // Update only if a new password is provided
            studentEmail: studentEmail || user.studentEmail,
            studentPassword: hashPassword, // Use the hashed password here
            studentInstitution: studentInstitution || user.studentInstitution,
            studentEducation: studentEducation || user.studentEducation  
        };

        await User.update(updateData, {
            where: {
                studentID: user.studentID
            }
        });

        res.status(200).json({ msg: "Your password has been updated!" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

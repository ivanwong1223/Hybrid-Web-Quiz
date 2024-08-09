import User from "../models/student_accModel.js";

export const verifyUser = async (req, res, next) =>{
    if(!req.session.studentID){
        return res.status(401).json({msg: "Please log in to your account first!"});
    }
    const user = await User.findOne({
        where: {
            studentID: req.session.studentID
        }
    });
    if(!user) return res.status(404).json({msg: "User not found"});
    req.studentID = user.studentID;
    next();
}

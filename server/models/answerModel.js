import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./student_accModel.js";
import Question from "./questionModel.js";

const { DataTypes } = Sequelize;

const Answer = db.define('student_answer', {
    answerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    answerIsCorrect: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    answered_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        references: {
            model: Users,
            key: 'studentID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    questionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        references: {
            model: Question,
            key: 'questionID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    freezeTableName: true,
    timestamps: false // Disable the automatic timestamps (createdAt, updatedAt)
});

Users.hasMany(Answer, { foreignKey: 'studentID' });
Answer.belongsTo(Users, { foreignKey: 'studentID' });

Question.hasMany(Answer, { foreignKey: 'questionID' });
Answer.belongsTo(Question, { foreignKey: 'questionID' });

export default Answer;

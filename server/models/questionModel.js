import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Quizzes from "./quizzesModel.js";

const { DataTypes } = Sequelize;

const Question = db.define('quiz_question', {
    questionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questionTitle: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questionMedia: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questionChoice1: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questionChoice2: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questionChoice3: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    questionChoice4: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    correctAnswer: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    feedback: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    quizID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        references: {
            model: Quizzes,
            key: 'quizID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    freezeTableName: true,
    timestamps: false // Disable the automatic timestamps (createdAt, updatedAt)
});

Quizzes.hasMany(Question, { foreignKey: 'quizID' });
Question.belongsTo(Quizzes, { foreignKey: 'quizID' });

export default Question;
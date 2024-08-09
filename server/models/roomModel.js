import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Quizzes from "./quizzesModel.js"; // Assuming this model exists

const { DataTypes } = Sequelize;

const Room = db.define('quiz_room', {
    roomID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    },
    roomCode:{
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    quizAttemptedTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
    timestamps: false // Disable the automatic timestamps (createdAt, updatedAt)
});

Quizzes.hasMany(Room, { foreignKey: 'quizID' });
Room.belongsTo(Quizzes, { foreignKey: 'quizID' });

export default Room;

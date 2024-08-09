import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./student_accModel.js";
import Room from "./roomModel.js";

const { DataTypes } = Sequelize;

const Leaderboard = db.define('quiz_leaderboard', {
    leaderboardID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    totalScored: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    attemptedTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
        validate: {
            notEmpty: true
        }
    },
    roomID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        references: {
            model: Room,
            key: 'roomID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    }
}, {
    freezeTableName: true,
    timestamps: false // Disable the automatic timestamps (createdAt, updatedAt)
});

Users.hasMany(Leaderboard, { foreignKey: 'studentID' });
Leaderboard.belongsTo(Users, { foreignKey: 'studentID' });

Room.hasMany(Leaderboard, { foreignKey: 'roomID' });
Leaderboard.belongsTo(Room, { foreignKey: 'roomID' });

export default Leaderboard;

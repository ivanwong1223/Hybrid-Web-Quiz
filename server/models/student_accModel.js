import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('student_acc',{
    studentID:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    studentName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255] // Adjusted the length to match your VARCHAR(255) specification
        }
    },
    studentEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    studentPassword: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    studentInstitution: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    studentEducation: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true, // Adjusted to allow null values as per your schema
        defaultValue: Sequelize.NOW,
        validate: {
            notEmpty: true
        }
    }
},{
    freezeTableName: true,
    timestamps: false // Disable the automatic timestamps (createdAt, updatedAt)
});

export default Users;
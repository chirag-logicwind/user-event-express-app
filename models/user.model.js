import sequelize from "./sequelize.js";
import { DataTypes } from "sequelize";

const User = sequelize.define('User', {
    name: { 
        type: DataTypes.STRING 
    },
    email: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    } 
}, {timestamps: true});

export default User;
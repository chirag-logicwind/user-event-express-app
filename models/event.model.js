import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './user.model.js';

const Event = sequelize.define('Event', {
    title: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { timestamps: true });

Event.belongsTo(User, { as: 'creator' });
User.hasMany(Event, { foreignKey: 'creatorId' });

export default Event;
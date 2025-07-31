import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import Event from "./event.model.js";

const EventInvite = sequelize.define('EventInvite', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true });

EventInvite.belongsTo(Event);
Event.hasMany(EventInvite);

export default EventInvite;
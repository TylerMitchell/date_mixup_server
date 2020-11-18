const { DataTypes } = require('sequelize');
const db = require('../db');

const Availability = db.define('availability', {
    day: {
        type: DataTypes.ENUM,
        values: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        allowNull: false
    },
    timeFrom: {
        type: DataTypes.DATE,
        allowNull: false
    },
    timeTo: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

module.exports = Availability;
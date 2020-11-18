const { DataTypes } = require('sequelize');
const db = require('../db');

const EventDetails = db.define('eventDetails', {
    eventDate: {
        type: DataTypes.DATE
    },
    timeFrom: {
        type: DataTypes.DATE
    },
    timeTo: {
        type: DataTypes.DATE
    },
    title: {
        type: DataTypes.STRING
    },
    body: {
        type: DataTypes.STRING
    }
});

module.exports = EventDetails;
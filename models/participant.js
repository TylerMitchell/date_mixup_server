const { DataTypes } = require('sequelize');
const db = require('../db');
const Profile = require("./profile");

const Participant = db.define('participant', {
    attendeeId: {
        type: DataTypes.INTEGER,
        references: {
            model: Profile,
            key: 'id'
        }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "Not Interested"
    }
});

module.exports = Participant;
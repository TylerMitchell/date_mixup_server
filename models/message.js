const { DataTypes } = require('sequelize');
const db = require('../db');

const Message = db.define('message', {
    dateSent: {
        type: DataTypes.DATE,
        allowNull: false
    },
    headline: {
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        values: ["Sent", "Read", "Deleted"],
        allowNull: false
    }
});

module.exports = Message;
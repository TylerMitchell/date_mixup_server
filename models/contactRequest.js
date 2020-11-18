const { DataTypes } = require('sequelize');
const db = require('../db');

const ContactRequest = db.define('contactRequest', {
    dateSent: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        values: ["Sent", "Accepted", "Deleted", "Expired"],
        allowNull: false
    }
});

module.exports = ContactRequest;
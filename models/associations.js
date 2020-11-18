const Models = require("./");

Models.Profile.belongsTo(Models.User, {
    allowNull: false
});
Models.User.hasMany(Models.Profile);

Models.Availability.belongsTo(Models.Profile, {
    foreignKey: {
        allowNull: false
    }
});
Models.Profile.hasMany(Models.Availability);

Models.Message.belongsTo(Models.Profile, {
    foreignKey: {
        name: "fromProfileId",
        allowNull: false
    }
});

Models.Message.belongsTo(Models.Profile, {
    foreignKey: {
        name: "toProfileId",
        allowNull: false
    }
});

Models.ContactRequest.belongsTo(Models.Profile, {
    foreignKey: {
        name: "fromProfileId",
        allowNull: false
    }
});

Models.ContactRequest.belongsTo(Models.Profile, {
    foreignKey: {
        name: "toProfileId",
        allowNull: false
    }
});

Models.EventDetails.belongsTo(Models.Profile, {
    foreignKey: {
        name: "eventCreatorId",
        allowNull: false
    }
});

Models.Participant.belongsTo(Models.EventDetails, {
    foreignKey: {
        name: "eventId",
        allowNull: false
    }
});

Models.EventDetails.hasOne(Models.Participant);
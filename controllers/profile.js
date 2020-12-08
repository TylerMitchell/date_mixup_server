const { Router } = require("express");
const { Profile, Availability } = require("../models");

ProfileController = Router();

ProfileController.get("/test", (req, res) => {
    console.log("Test route hit [profile]");
});

ProfileController.post("/", (req, res) => { //create a profile for yourself
    let { screenName, age, gender, bio } = req.body.profile;
    Profile.create({
        screenName: screenName,
        age: age ? age : null,
        gender: gender ? gender : null,
        bio:  bio ? bio : null,
        userId: req.user.id
    })
    .then( (profile) => {
        res.status(200).json({ profile: profile, message: "Profile Created!" });
    })
    .catch( (err) => {
        res.status(500).json({ message: "Unable to create a Profile!" });
    });
});

ProfileController.get("/", (req, res) => { //gets your profile information
    Profile.findOne({ where: { userId: req.user.id } })
        .then( (profile) => { res.status(200).json({ profile: profile, message: "Basic Profile Retrieved!" }); } )
        .catch( (err) => { res.status(500).json({ error: err, message: "Failed to Get Profile!" }); } );
        //TODO: 
});

ProfileController.put("/", (req, res) => { //updates your profile
    let {screenName, age, gender, bio, id} = req.body.profile;
    Profile.update({screenName: screenName, age: age, gender: gender, bio: bio}, { where: { id: id } } )
        .then( (data) => { res.status(200).json({ data: data, message: "Profile Updated!" }); } )
        .catch( (err) => { console.log(err); res.status(500).json({ error: err, message: "Unable to update profile!" }); } );
});

ProfileController.get("/:id", (req, res) => { //gets a users profile information if you have shared contacts

});

ProfileController.post("/getprofiles", (req, res) => { //gets a list of profiles by id
    let profileIdArr = req.body.profileIdArr;
    Profile.findAll({ where: { id: profileIdArr } })
        .then( (profiles) => { res.status(200).json({ profiles: profiles, message: "List retrieved Succesfully!" }); } )
        .catch( (err) => { res.status(500).json({ error: err, message: "Could not get Availabilities!" }); } );
});

ProfileController.post("/availability", (req, res) => { //adds to the list of available times
    let { day, timeFrom, timeTo, profileId } = req.body.availability;
    if( day && timeFrom && timeTo && profileId ){
        Availability.create( req.body.availability )
            .then( (availability) => { res.status(200).json({ availability: availability, message: "Availability Created!" }); } )
            .catch( (err) => { res.status(500).json({error: err, message: "Could not create that availability!" }); });
    } else{ res.status(500).json({ message: "Didn't include all relevant information" }); }
});

ProfileController.get("/availability/:id", (req, res) => { //gets list of Availabilities associated with this profile
    let profileId = req.params.id;
    Availability.findAll({ where: { profileId: profileId } })
        .then( (availabilities) => { res.status(200).json({ availabilities: availabilities, message: "List retrieved Succesfully!" }); } )
        .catch( (err) => { res.status(500).json({ error: err, message: "Could not get Availabilities!" }); } );
});

ProfileController.put("/availability", (req, res) => { //adds to the list of available times
    Availability.update( req.body.availability, { where: { id: req.body.availabilityId } } )
        .then( (availability) => { res.status(200).json({ availability: availability, message: "Availability Updated!" }); } )
        .catch( (err) => { res.status(500).json({error: err, message: "Could not update that availability!" }); });
});

ProfileController.delete("/availability", (req, res) => { //adds to the list of available times
    Availability.destroy({ where: { id: req.body.availabilityId } })
        .then( (num) => { res.status(200).json({ recordsDeleted: num, message: "Availability Deleted!" }); } )
        .catch( (err) => { res.status(500).json({error: err, message: "Could not delete that availability!" }); });
});

module.exports = ProfileController;
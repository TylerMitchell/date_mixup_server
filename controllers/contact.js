const { Router } = require("express");
const { ContactRequest } = require("../models");
const { Op } = require("sequelize");

ContactController = Router();

ContactController.post("/", (req, res) => { //gets a list of all accepted contactRequests
    const profileId = req.mainProfileId;
    ContactRequest.findAll({ 
        where: { 
            [Op.or]: [ 
                { fromProfileId: profileId, status: "Accepted" },
                { toProfileId:   profileId, status: "Accepted" }
            ]
        } 
    })
    .then( (contacts) => { res.status(200).json({ contacts: contacts, message: "Contact List Retrieved!" }); } )
    .catch( (err) => { res.status(500).json({error: err, message: "Issue fetching ContactRequests!" }); } );
});

ContactController.post("/requests", (req, res) => { //gets a list of all pending contactRequests
    const profileId = req.mainProfileId;
    ContactRequest.findAll({ 
        where: { 
            [Op.or]: [
                { fromProfileId: profileId, status: "Sent" }, 
                { toProfileId:   profileId, status: "Sent" } 
            ]
        } 
    })
    .then( (contacts) => { res.status(200).json({ contacts: contacts, message: "Contact List Retrieved!" }); } )
    .catch( (err) => { res.status(500).json({error: err, message: "Issue fetching ContactRequests!" }); } );
});

ContactController.post("/request", (req, res) => { //creates a ContactRequest entry
    req.body.contactRequest.fromProfileId = req.mainProfileId;
    const { dateSent, fromProfileId, toProfileId } = req.body.contactRequest;
    if( dateSent && fromProfileId && toProfileId ){
        req.body.contactRequest.status = "Sent";
        ContactRequest.create(req.body.contactRequest)
            .then( (data) => { res.status(200).json({ request: data, message: "Request Successfully Created!" }); } )
            .catch( (err) => { res.status(500).json({ error: err, message: "Failed to create ContactRequest" }); } );
    } else { res.status(500).json({ message: "Didn't supply all necessary information to create request!"}); }
});

ContactController.put("/accept", (req, res) => { //accepts a specific contactRequest
    const requestId = req.body.requestId;
    console.log("accept route hit: ", req.mainProfileId);
    ContactRequest.update( { status: "Accepted" }, { where: { id: requestId, toProfileId: req.mainProfileId } } )
        .then( (data) => { res.status(200).json({ request: data, message: `Updated requestId: ${requestId}` }); } )
        .catch( (err) => { res.status(500).json({ error: err, message: `Could not update requestId: ${requestId}!`}); } )
});

ContactController.delete("/", (req, res) => { //deletes a specific contactRequest
    const requestId = req.body.requestId;
    ContactRequest.update({ status: "Deleted" }, { where: { id: requestId, toProfileId: req.mainProfileId } })
        .then( (data) => { res.status(200).json({ request: data, message: `Successfully deleted requestId: ${requestId}` }); } )
        .catch( (err) => { res.status(500).json({ error: err, message: `Failed to Delete requestId: ${requestId}` }); } )
});

module.exports = ContactController;
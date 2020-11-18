const { Router } = require("express");
const { Message } = require("../models");
const { Op } =  require("sequelize");

MessageController = Router();

MessageController.get("/:otherProfileId", (req, res) => { //get all messages for profile from specific contact
    console.log("GET /messages/:otherProfileId");
    Message.findAll({ 
        where: { fromProfileId: req.params.otherProfileId, toProfileId: req.mainProfileId } 
    })
    .then( (messages) => { res.status(200).json({ messages: messages, message: "Messages Retrieved!" }); })
    .catch( (err) => { res.status(500).json({ error: err, message: "Unable to retrieve messages!" })} );
});

MessageController.get("/unread", (req, res) => { //get all messages with status unread
    console.log("GET /messages/unread");
    Message.findAll({ 
        where: { 
            [Op.or]: [ 
                {toProfileId: req.mainProfileId, status: "Sent" },
                {fromProfileId: req.mainProfileId, status: "Sent" }
            ]
        } 
    })
    .then( (unreadMessages) => { res.status(200).json({ unreadMessages: unreadMessages, message: "Unread Messages Retrieved!" }); } )
    .catch( (err) => { res.status(500).json({ error: err, message: "Unable to retrieve unread messages!" }); } );
});

MessageController.post("/send", (req, res) => { //send a message to a specific contact on your list
    console.log("POST /messages/send");
    const { dateSent, headline, body } =  req.body.outgoingMessage;
    if( dateSent && headline && body ){
        req.body.outgoingMessage.status = "Sent";
        Message.create( req.body.outgoingMessage )
            .then( (msg) => { res.status(200).json({ sentMessage: msg, message: "Message Sent!" }); })
            .catch( (err) => { res.status(500).json({ error: err, message: "Failed to send message!" }); });
    } else{ res.status(500).json({ message: "Didn't send all the required information!" }); }
});

MessageController.put("/markread", (req, res) => { //marks all messages as read that are unread for this profile
    console.log("PUT /messages/markread");
    Message.update({ status: "Read" }, { where: { toProfileId: req.mainProfileId, status: "Sent" } })
        .then( (data) => { res.status(200).json({ markedRead: data, message: "All messaged marked as read!" }); })
        .catch( (err) => { res.status(500).json({ error: err, message: "Failed to mark messages read!" }); });
});

MessageController.delete("/delete", (req, res) => { //Change a messages status to "Deleted"
    console.log("DELETE /messages/delete");
    Message.update({ status: "Deleted" }, { toProfileId: req.mainProfileId, id: req.body.messageId })
        .then( (data) => { res.status(200).json({ deleted: data, message: "Successfully deleted message!" }); } )
        .catch( (err) => { res.status(500).json({ error: err, message: "Failed to delete message!" }); } );
});

module.exports = MessageController;
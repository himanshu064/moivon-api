const Event = require("../model/event");

exports.allEvents = async (req,res) => {
    try {
       const event = new Event({
        title: req.body.title,
        decription,
        price,
        dates,
        venue,
        eventOrgDetail,
       }) 
    } catch (err) {
       res.status(500).send({status:"failed",error: err}) 
    }
}
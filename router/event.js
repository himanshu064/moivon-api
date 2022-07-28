const express = require("express");
const router = express.Router();
const eventController = require("../controller/event");
const {eventValidation} = require("../validationSchema/eventRules");
const validate = require("../validationSchema/validationMiddleware")

router.get("/:id",eventController.getById);
router.get("/",eventController.getAllEvent);
router.post("/",eventValidation(),validate,eventController.createEvent);
router.put("/:id",eventValidation(),validate,eventController.updateEvent);
router.delete("/:id",eventController.deleteEvent);

module.exports = router;
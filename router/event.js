const express = require("express");
const router = express.Router();
const eventController = require("../controller/event");

router.get("/",eventController.allEvents);

module.exports = router;
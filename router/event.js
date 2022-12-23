const express = require("express");
const router = express.Router();
const eventController = require("../controller/event");
const { eventValidation } = require("../validationSchema/eventRules");
const validate = require("../validationSchema/validationMiddleware");
const isAuth = require("../middleware/isAuth");

router.get("/admin", eventController.getAlAdminlEvent);
router.get("/:id", eventController.getById);
router.get("/", eventController.getAllEvent);
router.post("/", eventValidation(), validate, eventController.createEvent);
router.put("/:id", isAuth,eventValidation(), validate, eventController.updateEvent);
router.put("/status/:id", isAuth,eventController.publishEvent);
router.post("/deleteevents",isAuth, eventController.deleteEvents);
router.delete("/deleteimage",isAuth, eventController.deleteImage);
router.delete("/:id",isAuth, eventController.deleteEvent);

module.exports = router;

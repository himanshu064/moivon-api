const express = require("express");
const router = express.Router();
const miscController = require("../controller/misc");
let {contactUsValidation,newsLetterValidation} = require("../validationSchema/rules");
const validate = require("../validationSchema/validationMiddleware")

router.post("/contactus",contactUsValidation(),validate,miscController.contactUs);
//new letter routes
router.get("/newsletter",miscController.getNewsLetter);
router.post("/newsletter",newsLetterValidation(),validate,miscController.postNewsLetter);
router.put("/newsletter/:id",newsLetterValidation(),validate,miscController.putNewsLetter);
router.delete("/newsletter/:id",miscController.deleteNewsLetter);
router.post("/deletenewsletter",miscController.deleteNewsLetters);
module.exports = router
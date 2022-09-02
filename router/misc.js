const express = require("express");
const router = express.Router();
const miscController = require("../controller/misc");
let {contactUsValidation} = require("../validationSchema/rules");
const validate = require("../validationSchema/validationMiddleware")
router.post("/contactus",contactUsValidation(),validate,miscController.contactUs);

module.exports = router
const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

const {signupValidation,loginValidation,genreValidation} = require("../validationSchema/rules");
const validate = require("../validationSchema/validationMiddleware")

router.post("/signup",signupValidation(),validate,userController.signup);
router.post("/login",loginValidation(),validate,userController.login);


module.exports = router
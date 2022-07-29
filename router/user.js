const express = require("express");
const router = express.Router();
const userController = require("../controller/user");
const isAuth = require("../middleware/isAuth");
const {signupValidation,loginValidation,newPasswordValidation,changePasswordValidation} = require("../validationSchema/rules");
const validate = require("../validationSchema/validationMiddleware")

router.post("/signup",signupValidation(),validate,userController.signup);
router.post("/login",loginValidation(),validate,userController.login);
router.post("/refreshtoken",userController.refreshToken);
router.post("/forgetpassword",userController.forgetPassword);
router.post("/newpassword",newPasswordValidation(),validate,userController.newPassword);
router.post("/changepassword",isAuth,changePasswordValidation(),validate,userController.changePassword);
module.exports = router
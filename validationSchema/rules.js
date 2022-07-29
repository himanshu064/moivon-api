const { body, check } = require("express-validator");

function signupValidation() {
  return [
    body("name")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 5 })
      .withMessage("name field must not be empty & it should be 5 char long"),
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("email field structure must be standard email"),
    body("password")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 })
      .withMessage("password field must be 8 char long & a string"),
  ];
}
function loginValidation() {
  return [
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("email field structure must be standard email"),
    body("password")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 })
      .withMessage("password field must be 8 char long & a string"),
  ];
}

function newPasswordValidation() {
  return [
    body("token")
      .not()
      .isEmpty()
      .isString()
      .withMessage("token field must be a string"),
    body("password")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 })
      .withMessage("password field must be 8 char long & a string"),
  ];
}


function changePasswordValidation() {
  return [
    body("password")
    .not()
    .isEmpty()
    .isString()
    .isLength({ min: 8 })
    .withMessage("password field must be 8 char long & a string"),
    body("newPassword")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 8 })
      .withMessage("newPassword field must be 8 char long & a string"),
  ];
}

function genreValidation() {
  return [
    body("genre")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 3 })
      .withMessage(
        "genre field slould be string & its min length must be 3 char"
      ),
  ];
}
module.exports = {
  signupValidation,
  loginValidation,
  genreValidation,
  newPasswordValidation,
  changePasswordValidation
};

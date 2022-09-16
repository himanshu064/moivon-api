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

function heroImageValidation() {
  return [
    body("description")
      .isString()

      .withMessage("description field slould be string"),
  ];
}

function heroImageValidation() {
  return [
    body("description")
      .isString()

      .withMessage("description field slould be string"),
  ];
}
function contactUsValidation() {
  return [
    body("name")
      .not()
      .isEmpty()
      .isString()
      .withMessage("name field slould be string and not empty"),
    body("email")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("email field slould be of email structure and empty"),
    body("message")
      .not()
      .isEmpty()
      .isString()
      .withMessage("message field slould be string and not empty"),
  ];
}
function newsLetterValidation() {
  return [
    body("email")
      .not()
      .isEmpty()
      .isEmail().withMessage("email key should hold email structure type data and it should not be empty"),
  ];
}
module.exports = {
  signupValidation,
  loginValidation,
  genreValidation,
  newPasswordValidation,
  changePasswordValidation,
  heroImageValidation,
  contactUsValidation,
  newsLetterValidation
};

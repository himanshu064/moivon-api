const { body, check } = require("express-validator");

function eventValidation() {
  return [
    body("title")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 4 })
      .withMessage(
        "title field slould be string & its min length must be 4 char"
      ),
    body("description")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 20 })
      .withMessage(
        "description field slould be string & its min length must be 20 char"
      ),
    body("price")
      .not()
      .isEmpty()
      .isNumeric()
      .withMessage("description field slould be number"),
    body("dates")
      .not()
      .isEmpty()
      .isString()
      .withMessage("dates field slould be string"),
    body("location")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 4 })
      .withMessage(
        "location field slould be string & its min length must be 4 char"
      ),
    body("venue")
      .not()
      .isEmpty()
      .withMessage(
        "venue field slould be string & its min length must be 15 char"
      ),
    body("eventOrgDetail")
      .not()
      .isEmpty()
      .isString()
      .isLength({ min: 15 })
      .withMessage(
        "eventOrgDetail field slould be string & its min length must be 15 char"
      ),
  ];
}

module.exports = {
  eventValidation,
};

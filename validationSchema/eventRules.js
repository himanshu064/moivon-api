const { body, check } = require("express-validator");

function eventValidation() {
  return [
    body("title")
      .not()
      .isEmpty()
      .isString()
      .withMessage(
        "title field slould be string"
      ),
    body("description")
      .isString()
      .withMessage(
        "description field slould be string"
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
      .withMessage(
        "location field must not empty"
      ),
    body("venue")
      .not()
      .isEmpty()
      .withMessage(
        "venue field slould not empty"
      ),
    body("eventOrgDetail")
  
      .isString()
      .withMessage(
        "eventOrgDetail field slould be string"
      ),
  ];
}

module.exports = {
  eventValidation,
};

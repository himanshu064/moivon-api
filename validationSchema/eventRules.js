const { body, check } = require("express-validator");

function eventValidation() {
  return [
    body("title")
      .not()
      .isEmpty()
      .isString()
      .withMessage(
        "title field should be string"
      ),
    body("description")
      .isString()
      .withMessage(
        "description field should be string"
      ),
    body("price")
      // .not()
      // .isEmpty()
      .isNumeric()
      .withMessage("price field should be number"),
      body("startDate")
      .not()
      .isEmpty()
      .isString()
      .withMessage("endDate field should be string"),
    body("endDate")
      .not()
      .isEmpty()
      .isString()
      .withMessage("endDate field should be string"),
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
        "venue field should not empty"
      ),
    body("eventOrgDetail")
  
      .isString()
      .withMessage(
        "eventOrgDetail field should be string"
      ),
  ];
}

module.exports = {
  eventValidation,
};

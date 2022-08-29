const { body, check } = require("express-validator");

function eventValidation() {

  return [
    body("title")
      .not()
      .isEmpty()
      .isString()
      .withMessage("title field should be string"),
    body("description")
      .isString().optional({ nullable: true })
      .withMessage("description field should be string"),
    body("price")
      // .not()
      // .isEmpty()
      .default(0)
      .isNumeric()
      .withMessage("price field should be number"),
    body("startDate")
      .not()
      .isEmpty()
      .isString()
      .withMessage("startDate field should be string"),
    body("endDate")
      .not()
      .isEmpty()
      .isString()
      .withMessage("endDate field should be string"),
    body("location")
      .not()
      .isEmpty()
      .withMessage("location field must not empty"),
    body("venue").not().isEmpty().withMessage("venue field should not empty"),
    body("eventOrgDetail")
      .isString()
      .withMessage("eventOrgDetail field should be string"),
      body("eventUrl")
      .isString().optional({ nullable: true })
      .withMessage("eventUrl field should be string"),
      body("organizationUrl")
      .isString().optional({ nullable: true })
      .withMessage("organizationUrl field should be string"),
      body("organization")
      .isString().optional({ nullable: true })
      .withMessage("organization field should be string"),
      body("organizationIcon")
     .isBase64().optional({ nullable: true })
      .withMessage("organizationIcon field should be Base64"),
  ];
}

module.exports = {
  eventValidation,
};

const { body, validationResult } = require('express-validator')
const validate = async(req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
      return res.status(422).json({
        status: "failed",
        statusCode: 422,
        error: extractedErrors,
      })
  }
  
  module.exports = validate

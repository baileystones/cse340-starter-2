const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

validate.reviewRules = () => {
  return [
    body("review_text")
      .trim()
      .notEmpty()
      .withMessage("Review text requi`red")
  ]
}

validate.checkReviewData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Review cannot be empty")
    return res.redirect(`/inv/detail/${req.body.inv_id}`)
  }
  next()
}

module.exports = validate

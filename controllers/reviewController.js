const reviewModel = require("../models/review-model")

const reviewController = {}

/* *********************
 *  Process new review
 * ******************* */
reviewController.addReview = async function (req, res) {
  const { review_text, inv_id, account_id } = req.body

  await reviewModel.addReview(review_text, inv_id, account_id)

  req.flash("notice", "Review successfully added")
  res.redirect(`/inv/detail/${inv_id}`)
}

module.exports = reviewController

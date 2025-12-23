const express = require("express")
const utilities = require("../utilities")
const router = express.Router()
const reviewController = require("../controllers/reviewController")

router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors (reviewController.addReview)
)

module.exports = router
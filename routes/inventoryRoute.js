// Needed Resources 
const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildDetail)
)

router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router
// Needed Resources 
const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)

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
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.triggerError)
)

router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.get(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

router.post(
  "/add-inventory",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.post(
  "/update",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inv_id",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirm)
)

router.post(
  "/delete",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
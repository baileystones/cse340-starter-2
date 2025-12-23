const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const accountValidate = require("../utilities/account-validation")

// Protected account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Deliver account update view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

// Process account update
router.post(
  "/update",
  utilities.checkLogin,
  accountValidate.updateAccountRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout account
router.get(
  "/logout",
  utilities.handleErrors(accountController.logout)
)

module.exports = router
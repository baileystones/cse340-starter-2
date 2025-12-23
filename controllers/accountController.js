const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountController = {}

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
accountController.buildRegister = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash password before storing
  let hashedPassword
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    console.error(error)
    req.flash("notice", "Error processing registration.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      )

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          maxAge: 3600 * 1000
        })
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000
        })
      }

      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
  } catch (error) {
    console.error(error)
    throw new Error("Access Forbidden")
  }
}

/* ************************
 *  Account Management
 * ********************* */
accountController.buildAccountManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/index", {
    title: "Account Management",
    nav,
  })
}

/* ***************************
 *  Build account update view
 * ************************** */
accountController.buildUpdateView = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Update account info
 * ************************** */
accountController.updateAccount = async function (req, res) {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  const result = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (result) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    delete updatedAccount.account_password

    const newToken = jwt.sign(
      updatedAccount,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 * 1000 }
    )

    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", newToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", newToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }

    req.flash("notice", "Account updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Account update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

/* ***************************
 *  Update password
 * ************************** */
accountController.updatePassword = async function (req, res) {
  const { account_id, account_password } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)

  const result = await accountModel.updatePassword(
    account_id,
    hashedPassword
  )

  if (result) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Password update failed.")
    res.redirect(`/account/update/${account_id}`)
  }
}

/* ***************************
 *  Logout account
 * ************************** */
accountController.logout = async function (req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

module.exports = accountController
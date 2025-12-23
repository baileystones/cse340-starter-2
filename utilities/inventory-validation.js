const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/* **********************************
 * Classification validation rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage(
        "Classification name cannot contain spaces or special characters."
      ),
  ]
}

/* **********************************
 * Check classification data
 * ********************************* */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty().withMessage("Make required."),
    body("inv_model").trim().notEmpty().withMessage("Model required."),
    body("inv_year").isInt({ min: 1900 }).withMessage("Year required."),
    body("inv_description").trim().notEmpty().withMessage("Description required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price required."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles required."),
    body("inv_color").trim().notEmpty().withMessage("Color required."),
    body("classification_id").notEmpty().withMessage("Classification required."),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    )

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      ...req.body,
    })
    return
  }
  next()
}

/* ***************************
 * Check update inventory data
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate
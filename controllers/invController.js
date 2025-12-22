const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()
  const className = data[0].classification_name

  res.render("inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle details view
 * ************************** */
invCont.buildDetail = async function (req, res) {
  const inv_id = req.params.inv_id
  const vehicle = await invModel.getInventoryById(inv_id)
  const nav = await utilities.getNav()
  const detailHTML = utilities.buildVehicleDetail(vehicle)

  res.render("inventory/detail",{
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    detailHTML,
  })
}
invCont.triggerError = async function () {
  throw new Error("Intentional Server Error")
}

/* ***************************
 *  Add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 * Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result.rowCount > 0) {
    req.flash("notice", "Classification added successfully.")
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    res.redirect("/inv/add-classification")
  }
}

/* ***************************
 *  Add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 * Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const result = await invModel.addInventory(
    req.body.inv_make,
    req.body.inv_model,
    req.body.inv_year,
    req.body.inv_description,
    req.body.inv_image,
    req.body.inv_thumbnail,
    req.body.inv_price,
    req.body.inv_miles,
    req.body.inv_color,
    req.body.classification_id
  )

  if (result.rowCount > 0) {
    req.flash("notice", "Inventory item added successfully.")
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.redirect("/inv/add-inventory")
  }
}

module.exports = invCont
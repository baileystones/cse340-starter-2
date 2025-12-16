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

module.exports = invCont
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build the vehicle detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const vehicleData = await invModel.getVehicleById(inv_id)
    const vehicleHtml = await utilities.buildVehicleDetail(vehicleData)
    let nav = await utilities.getNav()
    const vehicleName = vehicleData.inv_make + " " + vehicleData.inv_model
    
    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      vehicleHtml,
    })
  } catch (error) {
    console.error("Error in buildByInvId:", error)
    next(error)
  }
}


module.exports = invCont



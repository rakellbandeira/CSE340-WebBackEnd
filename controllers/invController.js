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
  // Took off the [0]
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


/* ***************************
 *  Building inventory managmt view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()


  // Including classification dropdown for the delete functionality
  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    errors: null,
  })
}



/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const classResult = await invModel.addClassification(classification_name)
  
  if (classResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )

    // ERROR FOUND: After adding the classification dropdown,
    // the previous render was not passing the necessary data
    // So, Redirect instead of render again
    return res.redirect("/inv/")

  } else {
    req.flash("notice", "Sorry, the addition failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}


/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  
  const invResult = await invModel.addInventoryItem(
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
  )
  
  if (invResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )

    // ERROR FOUND: After adding the classification dropdown,
    // the previous render was not passing the necessary data
    // So, Redirect instead of render again
    return res.redirect("/inv/")

  } else {
    req.flash("notice", "Sorry, the addition failed.")
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }
}



/* ***************************
 *  Built Delete Confirmation View
 * ************************** */
invCont.buildDeleteConfirm = async function (req, res, next) {
 
  try {

        // Collect the inv_id from the incoming request
      const inv_id = parseInt(req.params.inv_id)
      console.log("Delete confirmation for inv_id:", inv_id)

      // Build the navigation for the new view
      let nav = await utilities.getNav()

      // Get the data for the inventory item from the database, 
      // using the existing model-based function and 
      // sending the inv_id to the function as a parameter.
      const itemData = await invModel.getVehicleById(inv_id)
      console.log("Item data retrieved:", itemData)

      if (!itemData) {
        req.flash("notice", "Vehicle not found.")
        return res.redirect("/inv/")
      }

      // Build a name variable to hold the inventory item's make and model
      // Commented this out, trying to debug it
      //const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
      
      // Call the res.render function to deliver the delete confirmation view.
      // Add the appropriate data to the data object 
      // to populate the title, nav, errors and inputs that exist in the form.
      res.render("./inventory/delete-confirm", {
        title: "Delete " + itemData.inv_make + "" + itemData.inv_model,
        nav,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
      })

  } catch (error) {
    console.error("Error in buildDeleteConfirm:", error)
    req.flash("notice", "Error loading delete page: " + error.message)
    return res.redirect("/inv/")
  }
  
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  
  // Collect the inv_id value from the request.body object. 
  // Use the parseInt function for the inv_id value during the collection and storage.
  const inv_id = parseInt(req.body.inv_id)
  

  // Pass the inv_id value to a model-based function to delete the inventory item. 
  // You will build the function in the next step of this activity.
  // Collect the value that should be returned from the model-based function into a local variable.
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  
  if (deleteResult) {
    req.flash(
      "notice", 
      `The item ${inv_id} was successfully deleted.`)
    
    res.redirect("/inv/")

  } else {

    // use the same route in the redirect 
    // that was used to build the delete confirmation view originally.
    // Does it work like this?
    req.flash(
      "notice", 
      "Delete failed. Please try again.")
    res.redirect("/inv/delete/" + inv_id)
  }
}


invCont.getInventoryJSON = async function (req, res) {
  const classification_id = parseInt(req.body.classification_id)
  const inventoryData = await invModel.getInventoryByClassificationId(classification_id)
  const classificationSelect = await utilities.buildClassificationList(classification_id)
  
  let inventoryDisplay = ""
  if (inventoryData.length > 0) {
    inventoryData.forEach((vehicle) => {
      inventoryDisplay += '<tr>'
      inventoryDisplay += `<td>${vehicle.inv_make} ${vehicle.inv_model}</td>`
      inventoryDisplay += '<td>'
      inventoryDisplay += `<a href="/inv/delete/${vehicle.inv_id}">Delete</a>`
      inventoryDisplay += '</td>'
      inventoryDisplay += '</tr>'
    })
  } else {
    inventoryDisplay = '<tr><td colspan="2">No inventory items found.</td></tr>'
  }

  let nav = await utilities.getNav()
  
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationSelect,
    inventoryDisplay,
    errors: null,
  })
}



module.exports = invCont



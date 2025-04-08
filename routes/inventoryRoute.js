// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view
router.get("/detail/:invId", invController.buildByInvId);

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
  )

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
  )

// Route to inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))


//Week05 - Team Activity
// Route to deliver the delete confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteConfirm))

// Route to process the deletion
//router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem))
router.post("/delete-confirm", utilities.handleErrors(invController.deleteInventoryItem))


// Process the classification view to the management view options
router.post("/getInventory", utilities.handleErrors(invController.getInventoryJSON))



module.exports = router;
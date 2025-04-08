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
// Week05 enhancements: Added middlewares to check permission
// Maybe the checkLogin isn't necessary anymore, check later
router.get("/add-classification", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification))

// Route to process add classification
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.classificationRules(),
    invValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
  )

// Route to build add inventory view
router.get("/add-inventory", 
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory))

// Route to process add inventory
router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAccountType,
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
  )

// Route to inventory management view
router.get("/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement))


//Week05 - Team Activity
// Route to deliver the delete confirmation view
router.get("/delete/:inv_id", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildDeleteConfirm))

// Route to process the deletion
//router.post("/delete", utilities.handleErrors(invController.deleteInventoryItem))
router.post("/delete-confirm", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.deleteInventoryItem))


// Process the classification view to the management view options
router.post("/getInventory", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.getInventoryJSON))



module.exports = router;
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Processing the registration data
// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


// Process the login attempt
/* router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
) */


//Week05
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

//Route to account management
router.get("/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement))


// Route to build account update view
router.get("/update/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountUpdateView))

// Route to process account update
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Route to process password update
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordUpdateRules(),
  regValidate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

// Route for logout
router.get("/logout", utilities.handleErrors(accountController.logout))


module.exports = router
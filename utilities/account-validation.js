const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [

    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), 

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), 

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("A valid email is required.")
      // this is to check if valid email does not
      // already exist in the database
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
    }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}


/* ******************************
 * Login Data Validation Rules
 * ***************************** */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required."),
  ]
}



/* ******************************
 * Check login data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}






// Wekk 05 - Management Enhancements Validation rules of accout update
/*  **********************************
 *  Update Account Data Validation Rules - Registration rules version 2.0 - without password
 * ********************************* */
validate.accountUpdateRules = () => {
  return [

    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), 

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), 

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("A valid email is required.")
      
  ]
}
/* ******************************
 * Check above account update and return errors or continue
 * ***************************** */
validate.checkAccountUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      accountData,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}



/*  **********************************
 *  Registration Data Validation Rules - version 3.0 - with password only
 * ********************************* */
validate.passwordUpdateRules = () => {
  return [

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}
/* ******************************
 * Check above password update and return errors or continue
 * ***************************** */
validate.checkPasswordUpdateData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      accountData
    })
    return
  }
  next()
}



module.exports = validate
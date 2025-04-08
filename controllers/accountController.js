const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const accountController = {}

//Week05
const jwt = require("jsonwebtoken")
require("dotenv").config()



/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function (req, res, next) {
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
   
      // Hash the password before storing
      let hashedPassword
        try {
          // regular password and cost (salt is generated automatically)
          hashedPassword = await bcrypt.hashSync(account_password, 10)
        } catch (error) {
          req.flash("notice", 'Sorry, there was an error processing the registration.')
          res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
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
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
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
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}
 


accountController.buildAccountManagement = async function  (req, res, next) {
  let nav = await utilities.getNav();

  //This is getting JWT from the cookie
  const token = req.cookies.jwt

  if(!token) {
    req.flash("notice", "Please log in to access account management.")
    return res.redirect("/account/login")
  }

  try {

    //This is verifying and getting user data
  const accountData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)


    // THis is the response, delivering the account view
    // and includes the JWT token verified
  res.render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing your credentials.')
    return res.redirect("/account/login")
  }

}




//Week 05 - Management Enhancements - Add functions for handling account update view
/* ****************************************
*  Deliver account update view
* *************************************** */
accountController.buildAccountUpdateView = async function (req, res) {
let nav = await utilities.getNav()

const account_id = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountById(account_id)

    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData
    })
  }



// Process Account update and password update, like registerAccount method above 
/* ****************************************
*  Process account update
* *************************************** */
accountController.updateAccount = async function (req, res) {
  
  let nav = await utilities.getNav()

  const { account_firstname, account_lastname, account_email, account_id } = req.body
 
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {

    // ERROR FOUND: Authorization process needed to proceed,
    //as a JWT update is needed for a new account data

     // Get the updated account data
     const accountData = await accountModel.getAccountById(account_id)
    
     // Update the JWT with new account data
     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
     if(process.env.NODE_ENV === 'development') {
       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }



    req.flash(
      "notice",
      `Account information updated succesfully`) 
    return res.redirect("/account")
  } else {
    req.flash(
      "notice", 
      "Sorry, the update failed.")
    // Must be sticky, Return data to the update view for correction if errors are found.
    const accountData = await accountModel.getAccountById(account_id)
    
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      accountData,
      account_firstname,
      account_lastname,
      account_email,

    }) 
  }
}


/* ****************************************
*  Process password update
* *************************************** */
accountController.updatePassword = async function (req, res) {
  
  const { account_password, account_id } = req.body
  console.log("accountController.updatePassword RequestBody:" + req.body)
  console.log("Account_Id:" + account_id)

   // Hash the password before storing
   let hashedPassword
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10)
   } catch (error) {
     req.flash("notice", 'Sorry, there was an error processing the password update.')
     return res.redirect(`/account/update/${account_id}`)
     }

     console.log("hashed password:" + hashedPassword)
 
 
  const updateResult = await accountModel.updatePassword( hashedPassword, account_id )

  if (updateResult) {
   
    req.flash(
      "notice",
      `Password updated succesfully`) 
    return res.redirect("/account")

  } else {
    req.flash(
      "notice", 
      "Sorry, the password update failed.")
    // Not sticky
    return res.redirect(`/account/update/${account_id}`)
  }
}



/* ****************************************
*  Process logout
* *************************************** */
accountController.logout = function (req, res) {
  res.clearCookie("jwt")
  req.flash(
    "notice", 
    "You have been logged out.")
  return res.redirect("/")
}




module.exports =  accountController

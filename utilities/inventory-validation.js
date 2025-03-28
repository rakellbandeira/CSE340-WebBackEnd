const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .isAlphanumeric()
      .withMessage("Classification name can only contain letters and numbers.")
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}


/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
    return [
      // Make is required
      body("inv_make")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle make."),
        
      // Model is required
      body("inv_model")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide the vehicle model."),
        
      // Year is required and must be 4 digits
      body("inv_year")
        .trim()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a valid 4-digit year."),
        
      // Description is required
      body("inv_description")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle description."),
        
      // Image path is required
      body("inv_image")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide an image path."),
        
      // Thumbnail path is required
      body("inv_thumbnail")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail path."),
        
      // Price is required and must be numeric
      body("inv_price")
        .trim()
        .isNumeric()
        .withMessage("Please provide a valid price (numbers only)."),
        
      // Miles is required and must be numeric
      body("inv_miles")
        .trim()
        .isNumeric()
        .withMessage("Please provide valid miles (numbers only)."),
        
      // Color is required
      body("inv_color")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a vehicle color."),
        
      // Classification is required
      body("classification_id")
        .isLength({ min: 1 })
        .withMessage("Please select a classification.")
    ]
  }
  
  /* ******************************
   * Check inventory data and return errors or continue to add
   * ***************************** */
  validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      let classificationList = await utilities.buildClassificationList(classification_id)
      res.render("inventory/add-inventory", {
        errors,
        title: "Add New Vehicle",
        nav,
        classificationList,
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
      return
    }
    next()
  }


module.exports = validate
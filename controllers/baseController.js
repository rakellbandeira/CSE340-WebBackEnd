const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    console.log("Setting flash message")
    req.flash("notice", "This is a flash message.")
    console.log("Rendering index view")
    res.render("index", {title: "Home", nav})
}

module.exports = baseController
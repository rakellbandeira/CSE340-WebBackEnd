const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


      /* **************************************
    * Build the vehicle detail view HTML
    * ************************************ */
    Util.buildVehicleDetail = async function(vehicle){
      let html = '<div class="vehicle-detail">'
      html += '<div class="vehicle-image">'
      html += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">`
      html += '</div>'
      html += '<div class="vehicle-info">'
      html += `<h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>`
      html += '<div class="vehicle-specs">'
      html += `<p class="vehicle-price">Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
      html += `<p class="vehicle-year">Year: ${vehicle.inv_year}</p>`
      html += `<p class="vehicle-miles">Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`
      html += `<p class="vehicle-color">Color: ${vehicle.inv_color}</p>`
      html += '</div>'
      html += `<p class="vehicle-description">${vehicle.inv_description}</p>`
      html += '</div>'
      html += '</div>'
      return html
    }


  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
  Util.handleErrors = (fn) => {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  };

module.exports = Util
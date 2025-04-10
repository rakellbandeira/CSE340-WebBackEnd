const pool = require ("../database/")

const reviewModel = {}


/* Add a review like Add new classification*/
reviewModel.addReview = async function (review_text, inv_id, account_id) {
    try{
        const sql = "INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
        const result = await pool.query(sql, [review_text, inv_id, account_id])
        return result.rows[0]

    } catch (error) {
        return error.message
    }
}


/* Get reviews by inv_id like getInventoryByClassificationId */
reviewModel.getReviewsByInventoryId = async function (inv_id) {
    try {
      const sql = `
        SELECT r.*, a.account_firstname, a.account_lastname 
        FROM review r 
        JOIN account a ON r.account_id = a.account_id 
        WHERE r.inv_id = $1 
        ORDER BY r.review_date DESC`
      const result = await pool.query(sql, [inv_id])
      return result.rows
    } catch (error) {
      return error.message
    }
  }



  /* Add or toggle a like */
  reviewModel.toggleLike = async function (inv_id, account_id) {
    try {
        //the like from that user in that car already exists? store in a variable
        const checkSql = "SELECT * FROM vehicle_like WHERE inv_id = $1 AND account_id = $2"
        const checkResult = await pool.query(checkSql, [inv_id, account_id])

        // if the like returns positive, remove it, BE AWARE OF rowCount. 
        if (checkResult.rowCount > 0) {
            const deleteSql = "DELETE FROM vehicle_like WHERE inv_id = $1 AND account_id = $2"
            await pool.query(deleteSql, [inv_id, account_id])

            // result will be transformed in json file later in the controller
            return {action: "unliked"}
        } else {
            const insertSql =  "INSERT INTO vehicle_like (inv_id, account_id) VALUES ($1, $2) RETURNING *"
            const result = await pool.query(insertSql, [inv_id, account_id])
            
            // result will be transformed in json file later in the controller
            return  { action: "liked", data: result.rows[0] }
        }

    } catch (error) {
        return error.message
    }
  }


// ERROR: I need a way to know if the logged user already have liked that inv_Id
  reviewModel.checkLikeStatus = async function (inv_id, account_id) {
  try {
    const sql = "SELECT * FROM vehicle_like WHERE inv_id = $1 AND account_id = $2"
    const result = await pool.query(sql, [inv_id, account_id])
    return result.rowCount > 0 // return true or a value here?
  } catch (error) {
    return false
  }
}



/* Count amount of likes of a vehicle */
reviewModel.countLikes = async function (inv_id) {
    try {
        const sql = "SELECT COUNT(*) FROM vehicle_like WHERE inv_id = $1"
        const result = await pool.query(sql, [inv_id])
        return parseInt(result.rows[0].count) // result will return a number or a string?

    } catch (error) {
        return 0
    }
    
}

module.exports = reviewModel
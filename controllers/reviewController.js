const reviewModel = require ("../models/review-model")
const utilities = require ("../utilities")

const reviewController = {}


/* Processing new reviews */
reviewController.addReview = async function (req, res) {

    const {review_text, inv_id } = req.body
    const account_id = res.locals.accountData.account_id

    const result = await reviewModel.addReview(review_text, inv_id, account_id)

    if (result) {
        req.flash(
            "notice",
            "Review added successfully!"
        )
    } else {
        req.flash(
            "notice",
            "Review submission failed."
        )
    }

    return res.redirect("/inv/detail/" + inv_id)
}


/* Processing like and unlike */
reviewController.toggleLike = async function (req, res) {
    const inv_id = req.params.invId
    const account_id = res.locals.accountData.account_id

    const result = await reviewModel.toggleLike(inv_id, account_id)

    // Retrieving {action = liked ? unliked } in json format
    return res.json(result)
}


module.exports = reviewController
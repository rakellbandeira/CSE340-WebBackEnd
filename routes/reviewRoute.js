const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")


// Process new review, needs to be logged
router.post(
    "/add",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.addReview)
)


// Toggle like button, needs to be logged
router.post(
    "/like/:invId",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.toggleLike)
)


// Get Like COunt, doesnt need to be logged
router.get(
    "/like-count/:invId",
    utilities.handleErrors(reviewController.getLikeCount)
)


module.exports = router
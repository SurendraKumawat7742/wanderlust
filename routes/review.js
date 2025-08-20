const express = require("express");
const router = express.Router({mergeParams : true}); //For req.params.id
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../Controller/reviews.js");

//Reviews
//post route
router.post("/", isLoggedIn, validateReview, wrapAsync(ReviewController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(ReviewController.deleteReview))

module.exports = router;
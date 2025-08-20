const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../Controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
     .route("/")
     .get(wrapAsync(ListingController.index))
     .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(ListingController.createListing))

//New route
router.get("/new", isLoggedIn, ListingController.renderNewForm); // \because router search new as id that is not possible therefore we write new route before id

router
     .route("/:id")
     .get(wrapAsync(ListingController.showListings))
     .put(isLoggedIn, isOwner, validateListing, upload.single('listing[image]'), wrapAsync(ListingController.updateListing))
     .delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing))

//Edit route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(ListingController.editListing))

module.exports = router;
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const BookingController = require("../Controller/booking.js");

router.get("/listings/:id/book", isLoggedIn, wrapAsync(BookingController.renderBookingForm));
router.post("/listings/:id/book", isLoggedIn, wrapAsync(BookingController.createBooking));

module.exports = router;
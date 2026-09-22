const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const razorpay = require("../config/razorpay.js");

module.exports.renderBookingForm = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("bookings/new.ejs", { listing });
};

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  // Find listing
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Convert dates
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    req.flash("error", "Please select valid dates.");

    return res.redirect(`/listings/${id}/book`);
  }

  if (endDate <= startDate) {
    req.flash("error", "Check-out date must be after check-in date!");

    return res.redirect(`/listings/${id}/book`);
  }

  // Validate guests
  if (!guests || Number(guests) < 1) {
    req.flash("error", "Number of guests must be at least 1.");

    return res.redirect(`/listings/${id}/book`);
  }

  // Check existing booking
  const existingBooking = await Booking.findOne({
    listing: listing._id,

    paymentStatus: "paid",

    checkIn: {
      $lt: endDate,
    },

    checkOut: {
      $gt: startDate,
    },
  });

  if (existingBooking) {
    req.flash(
      "error",
      "This listing is already booked for the selected dates.",
    );

    return res.redirect(`/listings/${id}/book`);
  }

  // Calculate nights
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const numberOfNights = Math.ceil((endDate - startDate) / millisecondsPerDay);

  // Calculate price
  const totalPrice = numberOfNights * listing.price;

  // Create booking
  const booking = new Booking({
    listing: listing._id,

    user: req.user._id,

    checkIn: startDate,

    checkOut: endDate,

    guests: Number(guests),

    totalPrice: totalPrice,

    paymentStatus: "pending",
  });

  await booking.save();

  let razorpayOrder;

  try {
    razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: booking._id.toString(),

      notes: {
        bookingId: booking._id.toString(),
        listingId: listing._id.toString(),
        userId: req.user._id.toString(),
      },
    });

  } catch (error) {
    console.log("========== RAZORPAY ERROR ==========");
    console.log(error);
    console.log("====================================");

    return res
      .status(500)
      .send("Razorpay Error: " + (error.error?.description || error.message));
  }

  // Save Razorpay order ID
  booking.razorpayOrderId = razorpayOrder.id;

  await booking.save();

  res.render("bookings/payment.ejs", {
    booking,
    listing,
    razorpayOrder,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
};

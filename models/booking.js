const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    listing:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    checkIn:{
        type: Date,
        required: true,
    },
    checkOut:{
        type: Date,
        required: true,
    },
    guests:{
        type: Number,
        required: true,
        min: 1,
    },
    totalPrice:{
        type: Number,
        required: true,
        min: 0,
    },
    paymentStatus:{
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    razorpayOrderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model("Booking", bookingSchema);
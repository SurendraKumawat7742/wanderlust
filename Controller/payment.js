const crypto = require("crypto");

const Booking = require("../models/booking.js");


module.exports.verifyPayment = async (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;


        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");


        if (expectedSignature !== razorpay_signature) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });

        }


        const booking = await Booking.findOne({
            razorpayOrderId: razorpay_order_id
        });


        if (!booking) {

            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });

        }


        booking.paymentStatus = "paid";

        booking.razorpayPaymentId =
            razorpay_payment_id;


        await booking.save();


        res.json({
            success: true,
            bookingId: booking._id
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });

    }
};